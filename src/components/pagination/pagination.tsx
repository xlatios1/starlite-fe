import * as React from 'react'
import Pagination from '@mui/material/Pagination'
import { Stack } from '@mui/material'
import '@styles/signin.css'

export default function Paginations({ total, getPaginationPage, walkthrough }) {
	return (
		<div className={`${walkthrough === 5 ? 'highlight-element' : ''}`}>
			{total > 1 ? (
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
						sx={{
							backgroundColor: walkthrough === 5 ? 'white' : '',
							borderRadius: '5px',
						}}
					/>
				</Stack>
			) : (
				<></>
			)}
		</div>
	)
}
