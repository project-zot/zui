import {createTheme} from '@mui/core'
import { adaptV4Theme } from '@mui/material/styles';
import {blue} from '@mui/core/colors'

export const theme = createTheme(adaptV4Theme({
    palette: {
      primary: {
        main: blue[400],
      }
    }
}));
