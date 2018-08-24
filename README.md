# Tunnel

## Table of content
- [Description](#description)
- [Authors](#authors)
- [Brainstorm](#brainstorm)
- [Usage](#usage)
    - [Dependencies](#dependencies)
- [License](#license)

## Description 

The purpose of game is to defy the notion of lazy-dominant-strategy-player type of gamers. The gameplay consists of two well-defined stages. In the first one, the player is offered a fast preview of the distribution of dots across the whole tunnel level. For the second stage, the game starts and the goal is to capture dots in some specific order of priority to get as many cumulative points as possible while reaching the end of the tunnel.  

*Where is the catch? How does it differ from the thousand of games we have played during childhood?*

**Complexity is rewarded**

During the first stage of the game, the player is expected to devise a strategy to complete the tunnel level requirements. However, the second stage includes obstacles that were not shown in the preview and complicate the game based on how the player performs. Thus, if the player seeks for the simple enough strategy that achieves the level requirements with minimum effort, the game will become insanely hard. 

As Douglas Horton once said:

> “The art of simplicity is a puzzle of complexity.” 

## Authors

 - [Gerson Lázaro](https://gersonlazaro.com/)
 - [Alfredo de la Fuente](https://alfo5123.github.io/)

## Brainstorm

- [ ] Assign different sizes and colors to the dots
- [ ] Add obstacles based on gravity changes, speed variations and variations of the tunnel width.
- [ ] Develop an adaptive mechanism for level generation of obstacles
- [ ] Keep a counter for the cumulative score
- [ ] Allow objects to accelerate (possibly at the end of the level)
- [ ] Generate levels from a database but adapt the obstacles according to the gameplay. 
- [ ] The only controls available are `up` and `down`. 
- [ ] If the player hits the obstactles, it can result in points penalty, or sudden game over. 
- [ ] Experiment with different obstacle geometries (rounded ones would be easier, I suspect)
- [ ] Play with light conditions (the closer we are to lightsource the slower we move)


## Usage

### Dependencies

```
git clone https://github.com/Alfo5123/Tunnel.git
```

## License 
[MIT License](https://github.com/Alfo5123/Tunnel/blob/master/LICENSE)
