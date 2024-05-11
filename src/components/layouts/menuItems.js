import itemTypesEnum from "components/layouts/itemTypesEnum";

export const items = [
  {
    title: 'Hra',
    caption: 'nová hra',
    icon: 'style',
    iconAngle: 180,
    link: 'game',
    params: [
      {
        label: 'Hráčů', type: itemTypesEnum.TOGGLE, value: 2,
        eval: 'this.store.game.setPlayers(value)',
        options: [
          {label: '2', value: 2},
          {label: '3', value: 3},
          {label: '4', value: 4},
          {label: '5', value: 5},
          // {label: '6', value: 6},
        ]
      },
      {name: 'isGameActive', label: 'Začít', store: 'game', type: itemTypesEnum.BUTTON, click: true}
    ]

  }, {
    title: 'Pokračovat',
    caption: 'rozehraná hra',
    icon: 'play_circle_outline',
    link: 'game'
  }, {
    title: 'Historie',
    caption: 'dříve hrané hry',
    icon: 'history',
    link: 'test'
  },
]
