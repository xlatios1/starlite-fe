import * as React from 'react'
import Pagination from '@mui/material/Pagination'
import { Stack } from '@mui/material'

export default function Paginations({ total, getPaginationPage }) {
	return (
		<Stack
			spacing={2}
			sx={{
				display: 'flex',
				flexDirection: 'row',
				width: '100%',
				justifyContent: 'center',
			}}
		>
			<Pagination
				count={total}
				showFirstButton
				showLastButton
				onChange={getPaginationPage}
			/>
		</Stack>
	)
}
