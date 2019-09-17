import React, { useState } from 'react'
import { Set } from 'immutable'
import { storiesOf } from '@connexta/ace/@storybook/react'
import { withKnobs, number, select } from '@connexta/ace/@storybook/addon-knobs'
import { action } from '@connexta/ace/@storybook/addon-actions'

const stories = storiesOf('Query Status', module)

stories.addDecorator(withKnobs)

stories.addDecorator(Story => <Story />)

const sleep = timeout =>
  new Promise(resolve => {
    setTimeout(resolve, timeout)
  })

import CancelIcon from '@material-ui/icons/Cancel'
import Checkbox from '@material-ui/core/Checkbox'
import CircularProgress from '@material-ui/core/CircularProgress'
import Divider from '@material-ui/core/Divider'
import IconButton from '@material-ui/core/IconButton'
import LinearProgress from '@material-ui/core/LinearProgress'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import ListItemText from '@material-ui/core/ListItemText'
import PlayCircleFilledIcon from '@material-ui/icons/PlayCircleFilled'

const formatStatus = status => {
  if (status.successful) {
    const { hits, count, elapsed } = status
    return `Available: ${count}, Possible: ${hits}, Time: ${elapsed}`
  }
  return status
}

const SourceStatus = props => {
  const {
    source,
    status,
    selected = false,

    onChange,
    onRun,
    onCancel,
  } = props
  return (
    <ListItem>
      {/*<ListItemIcon>
        {status === 'Pending' ? (
          <CircularProgress size={20} />
        ) : (
          <Checkbox
            edge="start"
            checked={selected}
            onChange={onChange}
            disabled={status === 'Canceled'}
            tabIndex={-1}
          />
        )}
      </ListItemIcon>*/}
      <ListItemText primary={source} secondary={formatStatus(status)} />
      <ListItemSecondaryAction>
        {status === 'Pending' ? (
          <IconButton
            title="Cancel"
            color="secondary"
            onClick={() => {
              onCancel(source)
            }}
          >
            <CancelIcon />
          </IconButton>
        ) : (
          <IconButton
            title="Run"
            color="primary"
            onClick={() => {
              onRun(source)
            }}
          >
            <PlayCircleFilledIcon />
          </IconButton>
        )}
      </ListItemSecondaryAction>
    </ListItem>
  )
}

const AllStatus = props => {
  const sources = Object.keys(props.sources).map(
    source => props.sources[source]
  )

  const pending = sources.filter(status => status === 'Pending').length
  const canceled = sources.filter(status => status === 'Canceled').length
  const completed = sources.filter(status => status.successful).length

  const status = `${pending} Pending, ${canceled} Canceled, ${completed} Completed`

  return <SourceStatus source="All Sources" status={status} />
}

const QueryStatus = props => {
  const { sources, onSelect } = props

  const selected = Set(props.selected)

  return (
    <List>
      {Object.keys(sources).map(source => {
        const status = sources[source]
        return (
          <SourceStatus
            source={source}
            status={status}
            selected={selected.has(source)}
            onRun={props.onRun}
            onCancel={props.onCancel}
            onChange={e => {
              if (e.target.checked) {
                onSelect(selected.add(source))
              } else {
                onSelect(selected.remove(source))
              }
            }}
          />
        )
      })}

      {/*<Divider /><AllStatus sources={sources} />*/}
    </List>
  )
}

const Component = ({ sources }) => {
  const [selected, setSelected] = useState([])

  return (
    <QueryStatus
      sources={sources}
      selected={selected}
      onSelect={setSelected}
      onRun={action('onRun')}
      onCancel={action('onCancel')}
    />
  )
}

const status = {
  hits: 10,
  count: 5,
  elapsed: 100,
  id: 'ddf.distribution',
  successful: true,
}

stories.add('one of each', () => {
  const sources = {
    'ddf.distribution': status,
    csw: 'Pending',
    twitter: 'Canceled',
  }

  return <Component sources={sources} />
})

stories.add('all available', () => {
  const sources = {
    'ddf.distribution': status,
    csw: status,
    twitter: status,
  }

  return <Component sources={sources} />
})

stories.add('all pending', () => {
  const sources = {
    'ddf.distribution': 'Pending',
    csw: 'Pending',
    twitter: 'Pending',
  }

  return <Component sources={sources} />
})

stories.add('all canceled', () => {
  const sources = {
    'ddf.distribution': 'Canceled',
    csw: 'Canceled',
    twitter: 'Canceled',
  }

  return <Component sources={sources} />
})

stories.add('all failed', () => {
  const sources = {
    'ddf.distribution': 'Failed',
    csw: 'Failed',
    twitter: 'Failed',
  }

  return <Component sources={sources} />
})
