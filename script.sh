#!/bin/bash

case "$1" in
gcz)
    git add .
    git cz
    ;;

gczp)
    git add .
    git cz
    git push origin head
    ;;
esac
