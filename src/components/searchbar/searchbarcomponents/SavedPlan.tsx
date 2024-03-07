import React from 'react'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select, { SelectChangeEvent } from '@mui/material/Select'

export default function SavedPlan({ plan, setPlan, setOrdered }) {
	const handleChange = (event: SelectChangeEvent) => {
		setPlan(+event.target.value)
		setOrdered((prev) => {
			const previous = { ...prev }
			previous.bestChance = false
			return previous
		})
	}

	return (
		<FormControl
			sx={{
				m: 1,
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center',
			}}
		>
			<Select
				value={plan.toString()}
				onChange={handleChange}
				displayEmpty
				inputProps={{
					'aria-label': 'Without label',
					MenuProps: { disableScrollLock: true },
				}}
				sx={{ width: '260px', height: '30px' }}
			>
				<MenuItem value={1}>Plan 1</MenuItem>
				<MenuItem value={2}>Plan 2</MenuItem>
				<MenuItem value={3}>Plan 3</MenuItem>
			</Select>
		</FormControl>
	)
}
