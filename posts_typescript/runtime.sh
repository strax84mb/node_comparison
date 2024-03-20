#!/usr/bin/bash

start=$(date "+%s%N")
node dist/main.js
end=$(date "+%s%N")
echo $(expr $end - $start)
