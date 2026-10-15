param([string]$Destination)
$ErrorActionPreference = 'Stop'
$bundleRoot = [IO.Path]::GetFullPath((Split-Path -Parent $PSScriptRoot))
if (-not $Destination) {
    $Destination = Join-Path (Split-Path -Parent $bundleRoot) ('robot-cari-kunci-50-level-' + (Get-Date -Format 'yyyyMMdd-HHmmss-fff') + '.zip')
}
$archivePath = [IO.Path]::GetFullPath($Destination)
if (Test-Path -LiteralPath $archivePath) { throw 'Arsip tujuan sudah ada. Pilih nama baru; tidak menimpa paket lama.' }
$checkpointRoot = Join-Path $bundleRoot 'checkpoints'
$latestCheckpoint = Get-ChildItem -LiteralPath $checkpointRoot -Directory -ErrorAction SilentlyContinue | Sort-Object Name -Descending | Select-Object -First 1
Add-Type -AssemblyName System.IO.Compression
Add-Type -AssemblyName System.IO.Compression.FileSystem
$stream = [IO.File]::Open($archivePath, [IO.FileMode]::CreateNew)
$zip = [IO.Compression.ZipArchive]::new($stream, [IO.Compression.ZipArchiveMode]::Create, $false)
$count = 0
try {
    foreach ($item in Get-ChildItem -LiteralPath $bundleRoot -File -Recurse -Force) {
        $relative = $item.FullName.Substring($bundleRoot.Length + 1).Replace('\', '/')
        if ($relative -match '(^|/)(\.git|node_modules|test-results)/|(^|/)\.server|vendor/package/|\.tgz$|\.zip$|(^|/)levels-50-draft\.js$') { continue }
        if ($relative.StartsWith('checkpoints/')) {
            if (-not $latestCheckpoint -or -not $relative.StartsWith('checkpoints/' + $latestCheckpoint.Name + '/')) { continue }
        }
        [IO.Compression.ZipFileExtensions]::CreateEntryFromFile($zip, $item.FullName, 'robot-cari-kunci/' + $relative, [IO.Compression.CompressionLevel]::Optimal) | Out-Null
        $count++
    }
} finally { $zip.Dispose(); $stream.Dispose() }
$check = [IO.Compression.ZipFile]::OpenRead($archivePath)
try {
    $names = @($check.Entries | ForEach-Object FullName)
    foreach ($required in @('index.html', 'app.js', 'engine.js', 'levels.js', 'scene.js', 'audio.js', 'MULAI.cmd', 'BERHENTI.cmd', 'runtime/node.exe', 'vendor/three.module.min.js', 'assets/music.mid', 'assets/music-preview.wav', 'config/FEATURE_MANIFEST.json', 'config/CLASS_CONFIG_SCHEMA.json', 'config/DEFAULT_CONFIG.json', 'config/CLASS_STATE.json', 'docs/QA_REPORT.md', 'docs/CHECKPOINT.md')) {
        if ($names -notcontains ('robot-cari-kunci/' + $required)) { throw "Arsip tidak lengkap: $required" }
    }
    if ($names | Where-Object { $_ -match '(^|/)\.git/|test-results/checkpoint-fixture-|(^|/)\.server' }) { throw 'Arsip memuat berkas sementara yang tidak seharusnya.' }
} finally { $check.Dispose() }
$hash = (Get-FileHash -LiteralPath $archivePath -Algorithm SHA256).Hash.ToLowerInvariant()
[ordered]@{ archive = $archivePath; files = $count; bytes = (Get-Item -LiteralPath $archivePath).Length; sha256 = $hash; checkpoint = $latestCheckpoint.Name } | ConvertTo-Json
