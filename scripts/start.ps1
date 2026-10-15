param([switch]$Stop)
$ErrorActionPreference = 'Stop'
$bundleRoot = Split-Path -Parent $PSScriptRoot
$serverFile = Join-Path $bundleRoot 'server.mjs'
$pidFile = Join-Path $bundleRoot '.server.pid'
$serverUrl = 'http://127.0.0.1:4186'
try {
    if ($Stop) {
        if (-not (Test-Path -LiteralPath $pidFile)) { Write-Host 'Tidak ada server yang dimulai launcher ini.'; exit 0 }
        $serverProcessId = [int](Get-Content -LiteralPath $pidFile -Raw)
        $serverProcess = Get-CimInstance Win32_Process -Filter "ProcessId = $serverProcessId" -ErrorAction SilentlyContinue
        if ($serverProcess -and $serverProcess.CommandLine -and $serverProcess.CommandLine.Contains($serverFile)) {
            Stop-Process -Id $serverProcessId
            Write-Host 'Server Robot Cari Kunci dihentikan.'
        } else { Write-Host 'Server sudah berhenti; tidak menghentikan proses lain.' }
        Remove-Item -LiteralPath $pidFile -ErrorAction SilentlyContinue
        exit 0
    }
    $existingServer = $null
    try { $existingServer = Invoke-RestMethod "$serverUrl/_health" -TimeoutSec 1 } catch { }
    if ($existingServer) {
        if ($existingServer.app -ne 'robot-cari-kunci' -or $existingServer.root -ne $bundleRoot) {
            throw 'Port 4186 dipakai paket/proses lain. Hentikan server lama dulu dengan BERHENTI.cmd dari folder paket lama.'
        }
        Start-Process $serverUrl
        exit 0
    }
    $nodeFile = Join-Path $bundleRoot 'runtime\node.exe'
    if (-not (Test-Path -LiteralPath $nodeFile)) {
        $nodeCommand = Get-Command node.exe -ErrorAction SilentlyContinue
        if ($nodeCommand) { $nodeFile = $nodeCommand.Source }
        elseif (Test-Path -LiteralPath 'C:\Program Files\nodejs\node.exe') { $nodeFile = 'C:\Program Files\nodejs\node.exe' }
        else { throw 'Node.js tidak tersedia. Gunakan paket lengkap yang berisi runtime\node.exe. Tidak ada unduhan otomatis.' }
    }
    $serverProcess = Start-Process -FilePath $nodeFile -ArgumentList ('"' + $serverFile + '"') -WorkingDirectory $bundleRoot -WindowStyle Hidden -PassThru -RedirectStandardOutput (Join-Path $bundleRoot '.server.log') -RedirectStandardError (Join-Path $bundleRoot '.server-error.log')
    Set-Content -LiteralPath $pidFile -Value $serverProcess.Id -Encoding ascii
    for ($attempt = 0; $attempt -lt 30; $attempt++) {
        Start-Sleep -Milliseconds 200
        try {
            $health = Invoke-RestMethod "$serverUrl/_health" -TimeoutSec 1
            if ($health.app -eq 'robot-cari-kunci' -and $health.root -eq $bundleRoot) {
                Start-Process $serverUrl
                Write-Host "Robot Cari Kunci dibuka: $serverUrl"
                exit 0
            }
        } catch { }
        $serverProcess.Refresh()
        if ($serverProcess.HasExited) { break }
    }
    throw 'Server tidak berhasil dibuka. Lihat .server-error.log di folder paket; pastikan port 4186 kosong.'
} catch {
    Write-Host ('GAGAL: ' + $_.Exception.Message) -ForegroundColor Red
    exit 1
}
