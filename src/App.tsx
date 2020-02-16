import React, {useState} from 'react';
import './App.css';
import Container from '@material-ui/core/Container';
import { AppBar } from '@material-ui/core';
import { createStyles, makeStyles, Theme, createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import {teal} from '@material-ui/core/colors/';
import Button from '@material-ui/core/Button';
import tagLU from "./tags";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

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

function getDescriptions(keyvalPair: [string, string]): any {
  try {
    let key: string = keyvalPair[0]
    let val: string = keyvalPair[1]
    return [tagLU[key]['desc'], tagLU[key]['enum'][val]]
  } catch {
    return [null, null]
  }
}

function SummaryTable(props: any) {
  let rows: any = props.data;
  const [filtertagsText, setFiltertagsText] = useState(localStorage['filtertagsText'] || "60,35,11")
  let filtertags: string[] = filtertagsText.split(",");
  let filteredRows: any[] = [];

  try {
    rows.forEach((row: any) => {
      let filteredRow: any[] = [];
      filtertags.forEach((tagnum: any, index) => {
        if (row[tagnum]) {
          filteredRow.push(<TableCell key={index}>{row[tagnum].value}</TableCell>);
        } else {
          filteredRow.push(<TableCell key={index}>{null}</TableCell>);
        }
      })
      filteredRows.push(filteredRow);
    })
  } catch {
    filteredRows = [];
  }
  const columnHeaderCells: any[] = filtertags.map((tag, index) => {
    try {
      return <TableCell key={index}>{tagLU[tag]["desc"]}</TableCell>
    } catch {
      return <TableCell key={index}>TAG NOT FOUND</TableCell>
    }
  })

  function handleChangeFiltertags(text: string) {
    setFiltertagsText(text);
    localStorage['filtertagsText'] = text;
  }

  return (
    <div>
    <Typography variant="body1">Summary Tags&nbsp;
    <input value={filtertags}
      onChange={e => handleChangeFiltertags(e.target.value)}
      pattern="[0-9,]+"
    />
    </Typography>
    
    <TableContainer component={Paper}>
      <Table className="summaryTable" size="small">
        <TableHead>
          <TableRow>
            {columnHeaderCells}
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredRows.map((row, index) => (
            <TableRow key={index}>{row}</TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
    </div>
  )
}

const toObjects = (fixString: string): any[] => {
  let lines: string[] = fixString.split('\n');
  let objArray: any = []
  lines.forEach( line => {
    let obj: any = {}
    if (line.slice(-1) === ';') {line = line.slice(0, -1)}
    line.split(';').forEach(pair => {
      let kv: any = pair.split('=')
      const [tagDesc, valDesc] = getDescriptions(kv)
      obj[kv[0]] = {
        'value': kv[1],
        'name': tagDesc,
        'description': valDesc
      }
    })
    objArray.push(obj);
  })
  return objArray
}

function App() {
  const classes = useStyles();
  const [fix, setFix] = useState(localStorage['fix'] || "60=10;11=sadjhfb;35=10"); // kept up to date with field
  const cachedParsedFix = localStorage['parsedFix'];
  var parsedFixDefault: object[];
  if (cachedParsedFix) {
    parsedFixDefault = JSON.parse(cachedParsedFix);
  } else {
    parsedFixDefault = toObjects(fix);
  }
  const [parsedFix, setParsedFix] = useState(parsedFixDefault)
  
  
  const handleChange = (newFix: string): void => {
    setFix(newFix);
    setParsedFix(toObjects(newFix));
    localStorage['fix'] = newFix;
    localStorage['parsedFix'] = JSON.stringify(toObjects(newFix));
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
    <SummaryTable data={parsedFix}/>
    </Container>
    <Button onClick={() => {console.log(parsedFix)}}>LOG FIX</Button>
    <Button onClick={() => {localStorage.clear()}}>Clear Local Storage</Button>
    </ThemeProvider>
  );
}

export default App;
