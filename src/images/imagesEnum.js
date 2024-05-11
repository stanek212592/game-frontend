// Cesty k obrázku a texturám
export default Object.freeze({

  WOOD: {path: process.env.backendServer + 'app/image/t_wood', type: 'texture'},
  SKY: {path: process.env.backendServer + 'app/image/t_sky', type: 'texture'},
  GRASS: {path: process.env.backendServer + 'app/image/t_grass', type: 'texture'},

  LOGO: {path: process.env.backendServer + 'app/image/a_background', label: 'Karetní hra prší', type: 'image'},


  CARD_BACK: {path: process.env.backendServer + 'app/image/c_back', type: 'image'},
  CARDS: {
    '1': {path: process.env.backendServer + 'app/image/c_6', type: 'image', label: 'LION_M'},
    '2': {path: process.env.backendServer + 'app/image/c_5', type: 'image', label: 'LION_F'},
    '3': {path: process.env.backendServer + 'app/image/c_4', type: 'image', label: 'LION_C'},
    '4': {path: process.env.backendServer + 'app/image/c_1', type: 'image', label: 'ELEPHANT_M'},
    '5': {path: process.env.backendServer + 'app/image/c_3', type: 'image', label: 'ELEPHANT_F'},
    '6': {path: process.env.backendServer + 'app/image/c_2', type: 'image', label: 'ELEPHANT_C'},
  },

})
