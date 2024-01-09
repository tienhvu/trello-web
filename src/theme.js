import { deepOrange, teal, cyan, orange } from '@mui/material/colors'
import { experimental_extendTheme as extendTheme } from '@mui/material/styles'

// Create a theme instance.
const theme = extendTheme({
  trello: {
    appBarHeight: '48px',
    boardBarHeight: '58px'
  },
  colorSchemes: {
    light: {
      palette: {
        primary: teal,
        secondary: deepOrange
      }
    //   spacing: (factor) => `${0.25 * factor}rem`
    },
    dark: {
      palette: {
        primary: cyan,
        secondary: orange
      }
    //   spacing: (factor) => `${0.25 * factor}rem`
    }
  }
})

export default theme