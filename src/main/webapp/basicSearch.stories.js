import React from 'react'
import { storiesOf } from '@connexta/ace/@storybook/react'
import { withKnobs, text, select } from '@connexta/ace/@storybook/addon-knobs'
import { action } from '@connexta/ace/@storybook/addon-actions'

import InputBase from '@material-ui/core/InputBase'
import CreateTwoToneIcon from '@material-ui/icons/CreateTwoTone'
import InputAdornment from '@material-ui/core/InputAdornment'
import TextField from '@material-ui/core/TextField'
import MoreVertTwoToneIcon from '@material-ui/icons/MoreVertTwoTone'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import CardActions from '@material-ui/core/CardActions'

import Switch from '@material-ui/core/Switch'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import FormControl from '@material-ui/core/FormControl'
import FormLabel from '@material-ui/core/FormLabel'
import Select from '@material-ui/core/Select'
import NativeSelect from '@material-ui/core/NativeSelect'
import InputLabel from '@material-ui/core/InputLabel'
import OutlinedInput from '@material-ui/core/OutlinedInput'
import Radio from '@material-ui/core/Radio'
import RadioGroup from '@material-ui/core/RadioGroup'
import Button from '@material-ui/core/Button'

const stories = storiesOf('BasicSearch', module)
stories.addDecorator(withKnobs)

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
      <FormControl fullWidth>
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
        <FormLabel value="fusam" labelPlacement="start">
          Match Case
        </FormLabel>
        <Switch color="primary" edge="start" />

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

const BasicSearch = props => {
  return (
    <div style={{ maxWidth: 600, margin: '20px auto' }}>
      <Card>
        <TopThing />
        <SearchStuff onSearch={props.onSearch} />
      </Card>
    </div>
  )
}

stories.add('basic', () => {
  return <BasicSearch onSearch={action('onSearch')} />
})
