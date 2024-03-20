#!/usr/bin/bash

start=$(date "+%s%N")
node src/main.cjs
end=$(date "+%s%N")
echo $(expr $end - $start)
