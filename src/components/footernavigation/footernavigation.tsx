import { Box, Typography, Grid } from '@mui/material'
import LinkedInIcon from '@mui/icons-material/LinkedIn'
import GitHubIcon from '@mui/icons-material/GitHub'
import React from 'react'

const FooterNavigation = () => {
	return (
		<Grid
			container
			sx={{
				background: '#88d6e2',
				padding: '10px 0',
				position: 'relative',
				bottom: '0',
				marginTop: '15px',
			}}
		>
			<Grid
				item
				xs={12}
				sx={{ height: '100%', display: 'flex', justifyContent: 'space-around' }}
			>
				<Grid container display="flex" flexDirection="row">
					<Grid item xs={6} display="flex" paddingLeft="20px">
						<Typography
							variant="h5"
							sx={{ fontWeight: 'bold', color: 'white' }}
						>
							Follow Me!
						</Typography>
						<a
							href="https://sg.linkedin.com/in/woon-yi-jun"
							target="_blank"
							rel="noopener noreferrer"
							style={{
								display: 'flex',
								flexDirection: 'row',
								color: 'rgba(0,121,186,255)',
								textDecoration: 'none',
								alignItems: 'center',
								padding: '0 20px',
							}}
						>
							<LinkedInIcon
								sx={{ color: 'rgb(0,119,181)', paddingRight: '2px' }}
							/>
							<Typography>LinkedIn</Typography>
						</a>
						<a
							href="https://github.com/xlatios1"
							target="_blank"
							rel="noopener noreferrer"
							style={{
								display: 'flex',
								flexDirection: 'row',
								color: 'black',
								textDecoration: 'none',
								alignItems: 'center',
							}}
						>
							<GitHubIcon sx={{ color: 'black', paddingRight: '2px' }} />
							<Typography>GitHub</Typography>
						</a>
					</Grid>

					<Grid
						item
						xs={6}
						display="flex"
						justifyContent="end"
						alignItems="center"
						paddingRight="8px"
					>
						<Typography>© 2024 Woon Yi Jun FYP Starlite Project</Typography>
					</Grid>
				</Grid>
				{/* </Box> */}
			</Grid>
		</Grid>
	)
}

export default FooterNavigation
