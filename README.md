# Tunnel

## Table of content
- [Description](#description)
- [Authors](#authors)
- [Usage](#usage)
    - [Dependencies](#dependencies)
- [Improvements](#improvements)
- [License](#licenses)

## Description 

We seek to defy the notion of lazy-dominant-strategy-player type of gamers. The goal of the game is to capture as many points as possible while avoiding hitting obstacles, in order to reach alive the end of the tunnel with enough points.  

*Where is the catch? How does it differ from the thousand of games we have played during childhood?*

**Complexity is rewarded**

The game includes obstacles generated based on how the player performs. Thus, if the player aims for the simple enough strategy that achieves the level requirements with minimum effort, the game will become insanely hard. In particular, difficulty increases when either the player is not moving much, or not capturing many points from very beginning. 

As Douglas Horton once said:

> “The art of simplicity is a puzzle of complexity.” 

## Authors

 - [Alfredo de la Fuente](https://alfo5123.github.io/)
 - [Sushanti Prabhu](https://www.facebook.com/sushanti.prabhu)

## Usage

### Dependencies

```
git clone https://github.com/Alfo5123/Tunnel.git
cd Tunnel 
```

## Improvements
- [x] Measure episodic entropy of wasp.
- [ ] Include a health-bar for number of left honey points.
- [ ] Develop an adaptive mechanism for level generation of obstacles based on gameplay.
- [x] Keep a counter for the cumulative score.
- [x] Allow objects to accelerate (specially at the end of the level).
- [x] The only controls available are `up` and `down`. 
- [ ] Experiment with different obstacle geometries (rounded ones would be easier, perhaps).
- [ ] Play with light conditions (the closer we are to lightsource the slower we move).
- [x] Add addictive musical background. 
- [ ] Display simple instructions.

## Licenses
Audio: [Omniworld](https://soundcloud.com/djviofficial/djvi-omniworld-1) by DJVI / [CC BY](https://creativecommons.org/licenses/by-nc-sa/3.0/)

Code: [MIT License](https://github.com/Alfo5123/Tunnel/blob/master/LICENSE)
