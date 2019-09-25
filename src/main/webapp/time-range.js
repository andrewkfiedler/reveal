// read default dates
// handle switching time ranges
// validation
import React from 'react'

import Checkbox from '@material-ui/core/Checkbox'
import FormControl from '@material-ui/core/FormControl'
import FormHelperText from '@material-ui/core/FormHelperText'
import Input from '@material-ui/core/Input'
import InputLabel from '@material-ui/core/InputLabel'
import ListItemText from '@material-ui/core/ListItemText'
import MenuItem from '@material-ui/core/MenuItem'
import Select from '@material-ui/core/Select'
import TextField from '@material-ui/core/TextField'

import DateFnsUtils from '@date-io/date-fns'
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider,
} from '@material-ui/pickers'

const timeProperties = [
  'created',
  'datetime.end',
  'datetime.start',
  'effective',
  'expiration',
  'metacard.created',
  'metacard.modified',
  'metacard.version.versioned-on',
  'modified',
]

const relativeUnits = ['minutes', 'hours', 'days', 'months', 'years']

const getDate = (date, defaultDate = new Date()) => {
  const dateCheck = new Date(date)

  if (isNaN(dateCheck.valueOf())) {
    return defaultDate
  }

  return dateCheck
}

const defaultRange = range => {
  if (range === undefined || range.type === undefined) {
    return {}
  }

  const { type } = range

  if (type === 'DURING') {
    const from = getDate(range.from)
    const to = getDate(range.to)
    const value = `${from} / ${to}`

    return {
      type,
      value,
      from,
      to,
    }
  }

  if (type === '=') {
    const last = range.last || ''
    const unit = range.unit || 'days'

    return {
      type,
      last,
      unit,
    }
  }

  return {
    type, // AFTER | BEFORE
    value: getDate(range.value),
  }
}

const TimeRange = props => {
  const timeRange = defaultRange(props.timeRange)
  const setTimeRange = timeRange => {
    if (typeof setTimeRange === 'function') {
      const range = defaultRange(timeRange)
      props.setTimeRange(range)
    }
  }
  const { errors = {} } = props

  const TimeRangeWhen = getTimeRangeWhen(timeRange.type)

  return (
    <div style={{ overflow: 'auto', flex: '1' }}>
      <div style={{ display: 'flex' }}>
        <FormControl fullWidth>
          <InputLabel>Time Range</InputLabel>
          <Select
            error={errors.type}
            value={timeRange.type || ''}
            onChange={e => {
              setTimeRange({ ...timeRange, type: e.target.value })
            }}
          >
            <MenuItem value={'AFTER'}>After</MenuItem>
            <MenuItem value={'BEFORE'}>Before</MenuItem>
            <MenuItem value={'DURING'}>Between</MenuItem>
            <MenuItem value={'='}>Relative</MenuItem>
          </Select>
          <FormHelperText error={errors.type}>{errors.type}</FormHelperText>
        </FormControl>
      </div>

      <TimeRangeWhen
        type={timeRange.type}
        timeRange={timeRange}
        setTimeRange={setTimeRange}
        errors={errors}
      />
    </div>
  )
}

const createTimeRange = label => props => {
  const { timeRange = {}, setTimeRange, errors = {} } = props

  return (
    <DatePicker
      label={label}
      defaultDate={getDate(timeRange.value)}
      error={errors.value}
      setDate={date => {
        setTimeRange({
          type: timeRange.type,
          value: date,
        })
      }}
    />
  )
}

const TimeRangeAfter = createTimeRange('Limit search to after this time')
const TimeRangeBefore = createTimeRange('Limit search to before this time')

const TimeRangeDuring = props => {
  const { timeRange = {}, setTimeRange, errors = {} } = props

  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <DatePicker
        label="From"
        error={errors.from}
        defaultDate={getDate(timeRange.from)}
        setDate={date => {
          const value = `${date}/${timeRange.to}`
          setTimeRange({ ...timeRange, from: date, value })
        }}
      />
      <div style={{ width: 20 }} />
      <DatePicker
        label="To"
        error={errors.to}
        defaultDate={getDate(timeRange.to)}
        setDate={date => {
          timeRange.to = date
          const value = `${timeRange.from}/${date}`
          setTimeRange({ ...timeRange, to: date, value })
        }}
      />
    </div>
  )
}

const TimeRangeRelative = props => {
  const { timeRange = {}, setTimeRange, errors = {} } = props

  return (
    <div style={{ overflow: 'auto', flex: '1', paddingTop: 10 }}>
      <div style={{ display: 'flex' }}>
        <div>
          <TextField
            label="Last"
            error={errors.last}
            variant="outlined"
            fullWidth
            value={timeRange.last}
            onChange={e => {
              setTimeRange({
                type: timeRange.type,
                last: e.target.value,
                unit: timeRange.unit,
              })
            }}
          />
          <FormHelperText error={errors.last}>{errors.last}</FormHelperText>
        </div>
        <div style={{ width: 20 }} />
        <FormControl fullWidth>
          <InputLabel>Unit</InputLabel>
          <Select
            value={timeRange.unit}
            error={errors.unit}
            onChange={e => {
              setTimeRange({
                type: timeRange.type,
                last: timeRange.last,
                unit: e.target.value,
              })
            }}
          >
            <MenuItem value={`minutes`}>Minutes</MenuItem>
            <MenuItem value={`hours`}>Hours</MenuItem>
            <MenuItem value={`days`}>Days</MenuItem>
            <MenuItem value={`months`}>Months</MenuItem>
            <MenuItem value={`years`}>Years</MenuItem>
          </Select>
        </FormControl>
      </div>
    </div>
  )
}

const DatePicker = props => {
  const { setDate, label, defaultDate, error } = props
  const [selectedDate, setSelectedDate] = React.useState(defaultDate)

  return (
    <div>
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <KeyboardDatePicker
          error={error}
          fullWidth
          disableToolbar
          variant="inline"
          format="MM/dd/yyyy"
          margin="normal"
          id="date-picker-inline"
          label={label}
          value={selectedDate}
          onChange={date => {
            setSelectedDate(date)
            setDate(date)
          }}
          KeyboardButtonProps={{
            'aria-label': 'change date',
          }}
        />
      </MuiPickersUtilsProvider>
      <FormHelperText error={error}>{error}</FormHelperText>
    </div>
  )
}

const Empty = () => null

const ranges = {
  AFTER: TimeRangeAfter,
  BEFORE: TimeRangeBefore,
  DURING: TimeRangeDuring,
  '=': TimeRangeRelative,
}

const getTimeRangeWhen = type => {
  return ranges[type] || Empty
}

export const validate = (timeRange = {}) => {
  const errors = {}

  const { type, value } = timeRange

  switch (type) {
    case undefined:
      errors.type = 'Type must supplied'
      break

    case 'DURING':
      const { to, from } = timeRange
      const toDate = getDate(to, null)
      if (toDate === null) {
        errors.to = `'To' date must be a valid date`
      }

      const fromDate = getDate(from, null)
      if (fromDate === null) {
        errors.from = `'From' date must be a valid date`
      }

      if (fromDate && toDate) {
        if (fromDate >= toDate) {
          errors.to = `'To' date must be after 'From' date`
          errors.from = `'From' date must be befor 'To' date`
        }
      }
      break

    case '=':
      const { last, unit } = timeRange
      if (isNaN(last) || last < 1) {
        errors.last = 'Value must be > 0'
      }

      if (!relativeUnits.includes(unit)) {
        errors.unit = 'Must include a valid unit'
      }
      break

    default:
      const dateValue = getDate(value, null)
      if (dateValue === null) {
        errors.value = `A valid date must be selected`
      }
  }

  return { ...errors }
}

export default TimeRange
export { TimeRangeAfter, TimeRangeBefore, TimeRangeDuring, TimeRangeRelative }
