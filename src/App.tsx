import React, { ClipboardEvent, useState, SyntheticEvent } from 'react';
import './App.css';
import TextField from '@material-ui/core/TextField';
import Container from '@material-ui/core/Container';
import { AppBar } from '@material-ui/core';
import { createStyles, makeStyles, Theme, createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import {blue, teal} from '@material-ui/core/colors/';
import { stringify } from 'querystring';
import Button from '@material-ui/core/Button'

const theme = createMuiTheme({
  palette: {
    primary: teal,
  },
});

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    title: {
      flexGrow: 1,
    },
  }),
);

function App() {
  const classes = useStyles();
  const [fix, setFix] = useState(""); // kept up to date with field
  const [parsedFix, setParsedFix] = useState([{}])

  const toObject = (fixString: string): any[] => {
    let lines: string[] = fixString.split('\n');
    let objArray: object[] = []
    lines.forEach( line => {
      if (line.slice(-1) === ';') {line = line.slice(0, -1)}
      let obj: any = {}
      line.split(';').forEach(pair => {
        let kv: any = pair.split('=')
        obj[kv[0]] = kv[1]
      })
      objArray.push(obj);
    })
    return objArray
  }

  const handleChange = (newFix: string): void => {
    setFix(newFix);
    setParsedFix(toObject(newFix));
  }

  return (
    <ThemeProvider theme={theme}>
    <AppBar position="sticky" style={{marginBottom: '50px'}}>
    <Toolbar>
      <Typography variant="h6" className={classes.title}>
        FIXpage
      </Typography>
    </Toolbar>
    </AppBar>
    <Container className="App" maxWidth="lg">
      <textarea
        value={fix}
        onChange={e => handleChange(e.target.value)}
        id="fixfield"
        placeholder="paste FIX"
        rows={5}
      />
    </Container>
    <Button onClick={() => {console.log(parsedFix)}}>THIS IS THE BUTTON</Button>
    </ThemeProvider>
  );
}

export default App;
