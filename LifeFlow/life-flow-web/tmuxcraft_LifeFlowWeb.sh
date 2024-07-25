#!/bin/bash
tmux new-session -d -s LifeFlowWeb -c ~/Documents/GitHub/capstone/LifeFlow/life-flow-web
tmux rename-window -t LifeFlowWeb: nvim
sleep 0.1
tmux send-keys -t LifeFlowWeb:nvim.1 "nvim" C-m
tmux split-window -t LifeFlowWeb:nvim.1 -c ~/Documents/GitHub/capstone/LifeFlow/life-flow-web -v -l 20
sleep 0.1
tmux send-keys -t LifeFlowWeb:nvim.2 "npm run dev" C-m
tmux split-window -t LifeFlowWeb:nvim.2 -c ~/Documents/GitHub/capstone/LifeFlow/life-flow-web -h -l 20
sleep 0.1
tmux send-keys -t LifeFlowWeb:nvim.3 "tty-clock -t" C-m
tmux new-window -t LifeFlowWeb -c ~/Documents/GitHub/capstone/LifeFlow/life-flow-web -n keycloak
sleep 0.1
tmux send-keys -t LifeFlowWeb:keycloak.1 "htop" C-m
tmux new-window -t LifeFlowWeb -c ~/Documents/GitHub/capstone/LifeFlow/life-flow-web -n kafka
