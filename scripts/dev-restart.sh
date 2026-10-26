#!/bin/sh
# Local helper: stop whatever holds the dev ports, then start `npm run dev` in the background.
LOG="${1:-dev.log}"
for port in 3000 27027 24678; do
  for pid in $(netstat -ano | grep -E "[:.]$port .*LISTEN" | awk '{print $NF}' | sort -u); do
    taskkill //PID "$pid" //F >/dev/null 2>&1 || kill -9 "$pid" 2>/dev/null
  done
done
sleep 2
cd "$(dirname "$0")/.." && (npm run dev > "$LOG" 2>&1 &)
for i in $(seq 1 120); do grep -q "running at\|Error" "$LOG" && break; sleep 1; done
grep -E "running at|Error" "$LOG" | head -3
