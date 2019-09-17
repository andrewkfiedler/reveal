import React, { Fragment, useState } from 'react'
import { storiesOf } from '@connexta/ace/@storybook/react'
import {
  withKnobs,
  number,
  boolean,
  text,
} from '@connexta/ace/@storybook/addon-knobs'
import { action } from '@connexta/ace/@storybook/addon-actions'

const stories = storiesOf('Result Froms', module)

stories.addDecorator(withKnobs)
stories.addDecorator(Story => <Story />)

import { Set, is } from 'immutable'
import { useUndoState } from './react-hooks'

import Button from '@material-ui/core/Button'
import Fab from '@material-ui/core/Fab'
import IconButton from '@material-ui/core/IconButton'

import TextField from '@material-ui/core/TextField'

import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'

import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'

import Typography from '@material-ui/core/Typography'
import RedoIcon from '@material-ui/icons/Redo'
import UndoIcon from '@material-ui/icons/Undo'

import ArrowBackIcon from '@material-ui/icons/ArrowBack'
import SwapHorizIcon from '@material-ui/icons/SwapHoriz'
import ArrowForwardIcon from '@material-ui/icons/ArrowForward'

import Dialog from '@material-ui/core/Dialog'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'

import FormLabel from '@material-ui/core/FormLabel'
import FormHelperText from '@material-ui/core/FormHelperText'

import Snackbar from '@material-ui/core/Snackbar'

import metacardTypes from './api/metacard-type.json'

const Attributes = props => {
  const { title, text, setText, attributes, total, onSelect } = props

  return (
    <div style={{ maxHeight: '100%', flex: '1', alignItems: 'stretch' }}>
      <Card
        style={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          boxSizing: 'border-box',
        }}
      >
        <CardContent style={{ paddingBottom: 0 }}>
          <Typography variant="h6" color="textSecondary">
            {title}
            {attributes.length !== total
              ? ` (${attributes.length}/${total} visible)`
              : null}
          </Typography>
          <TextField
            fullWidth
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder="type to filter..."
          />
        </CardContent>
        <List dense={true} style={{ flex: '1', overflow: 'auto' }}>
          {attributes.map(type => {
            return (
              <ListItem button onClick={() => onSelect([type])}>
                <ListItemText primary={type} />
              </ListItem>
            )
          })}
        </List>
      </Card>
    </div>
  )
}

const HistoryControls = props => {
  const { canUndo, onUndo, canRedo, onRedo } = props
  return (
    <div>
      <Button variant="outlined" onClick={onUndo} disabled={!canUndo}>
        <UndoIcon /> Undo
      </Button>
      <div style={{ width: 10, display: 'inline-block' }} />
      <Button variant="outlined" onClick={onRedo} disabled={!canRedo}>
        <RedoIcon /> Redo
      </Button>
    </div>
  )
}

const TransferControls = props => {
  const { state, setState, selectedVisible, availableVisible } = props

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '0 20px',
      }}
    >
      <Fab
        size="small"
        disabled={availableVisible.length === 0}
        color="primary"
        onClick={() => setState(state.union(availableVisible))}
      >
        <ArrowForwardIcon />
      </Fab>

      <div style={{ height: 10 }} />

      <Fab
        size="small"
        color="primary"
        disabled={selectedVisible.length === 0 && availableVisible.length === 0}
        onClick={() =>
          setState(state.subtract(selectedVisible).union(availableVisible))
        }
      >
        <SwapHorizIcon />
      </Fab>

      <div style={{ height: 10 }} />

      <Fab
        size="small"
        color="primary"
        disabled={selectedVisible.length === 0}
        onClick={() => setState(state.subtract(selectedVisible))}
      >
        <ArrowBackIcon />
      </Fab>
    </div>
  )
}

const TransferList = props => {
  const [selectedText, setSelectedText] = useState('')
  const [availableText, setAvailableText] = useState('')

  const { state, setState, attributes = [], ...rest } = props
  const selected = attributes.filter(a => state.has(a))
  const available = attributes.filter(a => !state.has(a))

  const selectedVisible = selected.filter(type => type.match(selectedText))
  const availableVisible = available.filter(type => type.match(availableText))

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        maxHeight: '100%',
        boxSizing: 'border-box',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: 3,
          marginBottom: 10,
        }}
      >
        <div>
          <FormLabel required={props.required} error={props.error}>
            {props.label}
          </FormLabel>
          <FormHelperText error={props.error}>
            {props.helperText}
          </FormHelperText>
        </div>

        <HistoryControls {...rest} />
      </div>

      <div
        style={{ display: 'flex', flex: '1', overflow: 'hidden', padding: 3 }}
      >
        <Attributes
          text={availableText}
          setText={setAvailableText}
          total={available.length}
          title="Available"
          onSelect={a => setState(state.union(a))}
          attributes={availableVisible}
        />

        <TransferControls
          state={state}
          setState={setState}
          selectedVisible={selectedVisible}
          availableVisible={availableVisible}
        />

        <Attributes
          text={selectedText}
          setText={setSelectedText}
          total={selected.length}
          title="Selected"
          onSelect={a => setState(state.subtract(a))}
          attributes={selectedVisible}
        />
      </div>
    </div>
  )
}

const validate = (form = {}) => {
  const { title, description } = form

  const attributes = Set(form.attributes)

  const errors = {}

  if (typeof title !== 'string') {
    errors.title = 'Title must be string'
  } else if (title.trim() === '') {
    errors.title = 'Title must not be empty'
  }

  if (description !== undefined && typeof description !== 'string') {
    errors.description = 'Description must be string'
  }

  if (attributes.isEmpty()) {
    errors.attributes = 'Attributes cannot be empty'
  }

  return errors
}

const Editor = props => {
  const { form = {}, attributes = [], onCancel, onSave } = props

  const { state, setState, ...rest } = useUndoState(Set(form.attributes))

  const [title, setTitle] = useState(form.title || '')
  const [description, setDescription] = useState(form.description || '')

  const errors = validate({ title, description, attributes: state })

  const allFields = ['title', 'attributes']

  const [touched, setTouched] = useState(Set())

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        maxHeight: '100%',
        padding: 20,
        boxSizing: 'border-box',
      }}
    >
      <Typography variant="h3" style={{ marginBottom: 20 }}>
        Result Form
      </Typography>
      <TextField
        autoFocus
        required
        fullWidth
        onBlur={() => {
          //setTouched(Set(touched).add('title'))
        }}
        label="Title"
        style={{ marginBottom: 20 }}
        value={title}
        error={touched.has('title') && errors.title !== undefined}
        helperText={touched.has('title') ? errors.title : undefined}
        onChange={e => setTitle(e.target.value)}
      />
      <TextField
        fullWidth
        rows={2}
        multiline
        onBlur={() => {
          setTouched(touched.add('description'))
        }}
        label="Description"
        style={{ marginBottom: 30 }}
        value={description}
        onChange={e => setDescription(e.target.value)}
      />

      <TransferList
        state={state}
        setState={setState}
        label="Attributes"
        required
        attributes={attributes}
        error={touched.has('attributes') && errors.attributes !== undefined}
        helperText={touched.has('attributes') ? errors.attributes : undefined}
        {...rest}
      />

      <div
        style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 20 }}
      >
        <Button variant="outlined" color="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <div style={{ width: 10, display: 'inline-block' }} />
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            if (Object.keys(errors).length === 0) {
              const resultForm = {
                title,
                description,
                attributes: state.toJSON(),
              }
              onSave(resultForm)
            } else {
              setTouched(touched.union(allFields))
            }
          }}
        >
          Save
        </Button>
      </div>
    </div>
  )
}

stories.add('transfer list', () => {
  const props = useUndoState(Set())

  const total = number('Number of Attributes', 100)
  const required = boolean('Required', false)
  const error = boolean('Error', false)
  const label = text('Label', 'Label')
  const helperText = text('Helper Text', 'Helper text')

  const attributes = []

  for (let i = 0; i < total; i++) {
    attributes.push(`Attribute #${i}`)
  }

  return (
    <div style={{ height: 'calc(100vh - 16px)' }}>
      <TransferList
        label={label}
        required={required}
        helperText={helperText}
        error={error}
        attributes={attributes}
        {...props}
      />
    </div>
  )
})

const types = Object.keys(metacardTypes).reduce(
  (allAttributes, metacardType) => {
    return Object.assign(allAttributes, metacardTypes[metacardType])
  },
  {}
)

stories.add('editor', () => {
  const attributes = Object.keys(types).sort()

  const resultForm = {
    title: 'Example Title',
    description: 'Example Description',
    attributes: ['id'],
  }

  const fillForm = boolean('Fill Form', false)

  return (
    <div style={{ height: 'calc(100vh - 16px)' }}>
      <Editor
        attributes={attributes}
        form={fillForm ? resultForm : undefined}
        onSave={action('onSave')}
        onCancel={action('onCancel')}
      />
    </div>
  )
})

stories.add('with modal', () => {
  const [open, setOpen] = useState(true)

  return (
    <Fragment>
      <Button onClick={() => setOpen(true)}>open</Button>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Use Google's location service?
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Let Google help apps determine location. This means sending
            anonymous location data to Google, even when no apps are running.
          </DialogContentText>
        </DialogContent>
      </Dialog>
    </Fragment>
  )
})
