import React from 'react'
import { connect } from 'react-redux'

import Button from '@material-ui/core/Button'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import CreateTwoToneIcon from '@material-ui/icons/CreateTwoTone'
import FormControl from '@material-ui/core/FormControl'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import FormLabel from '@material-ui/core/FormLabel'
import InputAdornment from '@material-ui/core/InputAdornment'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import MoreVertTwoToneIcon from '@material-ui/icons/MoreVertTwoTone'
import Radio from '@material-ui/core/Radio'
import RadioGroup from '@material-ui/core/RadioGroup'
import Switch from '@material-ui/core/Switch'
import TextField from '@material-ui/core/TextField'

import { executeQuery } from './intrigue-api/lib/cache'

const TopThing = () => {
  const [anchorEl, setAnchorEl] = React.useState(null)
  function handleClick(event) {
    setAnchorEl(event.currentTarget)
  }

  function handleClose() {
    setAnchorEl(null)
  }

  return (
    <CardContent>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <TextField
          fullWidth
          placeholder="Search Name"
          InputProps={{
            'aria-label': 'naked',
            endAdornment: (
              <InputAdornment position="end">
                <CreateTwoToneIcon />
              </InputAdornment>
            ),
          }}
        />
        <Button onClick={handleClick} style={{ marginLeft: '20px' }}>
          <MoreVertTwoToneIcon />
        </Button>
      </div>
      <Menu
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem onClick={handleClose}>Text Search</MenuItem>
        <MenuItem onClick={handleClose}>Basic Search</MenuItem>
        <MenuItem onClick={handleClose}>Advanced Search</MenuItem>
        <MenuItem onClick={handleClose}>Use Another Search Form</MenuItem>
        <MenuItem onClick={handleClose}>Reset</MenuItem>
      </Menu>
    </CardContent>
  )
}

const SearchStuff = props => {
  const [matchCase, setMatchCase] = React.useState('yes')
  const handleMatchCase = (event, matchCase) => {
    if (matchCase !== null) {
      setMatchCase(matchCase)
      console.log('fusam', matchCase)
    }
  }

  const [filterTree, setFilterTree] = React.useState({
    type: 'ILIKE',
    property: 'anyText',
    value: '',
  })

  return (
    <CardContent>
      <TextField
        label="Text"
        variant="outlined"
        fullWidth
        value={filterTree.value}
        onChange={e => {
          const value = e.target.value
          setFilterTree({ ...filterTree, value })
        }}
      />
      <FormControl fullWidth margin={'dense'}>
        <FormLabel value="fusam">Match Case</FormLabel>
        <FormControlLabel control={<Switch color="primary" />} />

        <FormLabel>Located</FormLabel>
        <RadioGroup row>
          <FormControlLabel
            value="anywhere"
            control={<Radio color="primary" />}
            label="Anywhere"
          />
          <FormControlLabel
            value="specific"
            control={<Radio color="primary" />}
            label="Somewhere Specific"
          />
        </RadioGroup>

        <div>
          <FormLabel>Match Types</FormLabel>
          <RadioGroup row>
            <FormControlLabel
              value="any"
              control={<Radio color="primary" />}
              label="Any"
            />
            <FormControlLabel
              value="specific"
              control={<Radio color="primary" />}
              label="Specific"
            />
          </RadioGroup>
        </div>

        <FormLabel>Settings</FormLabel>
      </FormControl>
      <Button
        fullWidth
        variant="contained"
        color="primary"
        onClick={() => {
          props.onSearch(filterTree)
        }}
      >
        Search
      </Button>
    </CardContent>
  )
}

const defaultIsh = filterTree => ({
  srcs: ['ddf.distribution', 'cache', 'hello'],
  start: 1,
  count: 250,
  filterTree,
  sorts: [
    {
      attribute: 'modified',
      direction: 'descending',
    },
  ],
  id: '313a84858daa4ef5980d4b11a745d6d3',
  spellcheck: false,
  phonetics: false,
  batchId: '5a3f400c2e1e410e8d37494500173ca4',
})

export const BasicSearch = props => {
  return (
    <div style={{ maxWidth: 600, margin: '20px auto' }}>
      <Card>
        <TopThing />
        <SearchStuff
          onSearch={filterTree => {
            props.onSearch(defaultIsh(filterTree))
          }}
        />
      </Card>
    </div>
  )
}

const mapDispatchToProps = { onSearch: executeQuery }

export default connect(
  null,
  mapDispatchToProps
)(BasicSearch)
