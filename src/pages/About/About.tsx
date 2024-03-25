/* eslint-disable jsx-a11y/alt-text */
import logo from '@assets/logo.png'
import selfImage from '@assets/me.jpg'
import './about.css'
import FeedbackForm from '@components/formcontrol/feedbackform.tsx'
import { Box, Typography } from '@mui/material'
import { openLoading, closeLoading } from '@store/loading/loadingSlice.ts'
import { useDispatch } from 'react-redux'
import React from 'react'

const About = () => {
	const dispatch = useDispatch()
	dispatch(openLoading())
	setTimeout(async () => {
		dispatch(closeLoading())
	}, 1000)

	window.scrollTo({ top: 0, behavior: 'smooth' })

	return (
		<section className="aboutpage">
			<div className="logo-container">
				<img className="logo" src={logo} alt="starlite" />
			</div>
			<div style={{ display: 'flex', justifyContent: 'center' }}>
				<div>
					<Box
						sx={{
							display: 'flex',
							height: '100%',
							justifyContent: 'space-between',
						}}
					>
						<Box
							sx={{
								color: '#5c5959',
								width: '480px',
								paddingRight: '20px',
							}}
						>
							<Typography
								color="#88d6e2"
								fontWeight="bold"
								fontSize="30px"
								textAlign="right"
							>
								My Story
							</Typography>
							<Typography
								sx={{
									color: '#5c5959',
									textAlign: 'right',
									marginTop: '10px',
									marginBottom: '40px',
								}}
							>
								Hi! I am Woon Yi Jun, a final year NTU student, studying
								computer science as my passion and goal to be a Software
								Architect. Before the start of every semester, we have to sit
								down and wrack our minds to plan our curriculum. We have all
								been through Star Wars, or are yet to. This planning process is
								a stepping stone towards the day we don our graduation gown,
								something to pat us on the back and say, 'I did it.' This
								process should be something we should look forward to; however,
								planning for it is not always the easiest thing to do.
								<br />
								<br />
								Hence, I am thrilled to introduce Starlite, the first platform
								ever designed to automate the way we approach curriculum
								timetable planning. Starlite emerges from a deep understanding
								of the challenges we students faced in curating our schedules,
								to mix and match different indexes just to find that it is not
								compatible or ideal.
							</Typography>
							<Typography
								color="#88d6e2"
								fontWeight="bold"
								fontSize="30px"
								textAlign="right"
							>
								Empowering Student Choices
							</Typography>
							<Typography
								sx={{
									color: '#5c5959',
									textAlign: 'right',
									marginTop: '10px',
									marginBottom: '40px',
								}}
							>
								Starlite is driven by the belief that every student's journey at
								NTU should be characterized by flexibility and empowerment. I
								understand that each student has unique preferences, academic
								pursuits, and personal commitments. I once had 3 part time jobs
								while studying, and it was really difficult to plan my schedule
								to fit my need. Starlite empowers you to take control of your
								timetable, ensuring that it not only meets academic requirements
								but aligns seamlessly with your lifestyle and personal goals
								with ease.
							</Typography>
							<Typography
								color="#88d6e2"
								fontWeight="bold"
								fontSize="30px"
								textAlign="right"
							>
								Efficiency through Automation
							</Typography>
							<Typography
								sx={{
									color: '#5c5959',
									textAlign: 'right',
									marginTop: '10px',
									marginBottom: '40px',
								}}
							>
								Gone are the days of manually navigating through countless
								Courses-Index combinations. Starlite employs cutting-edge
								automation to simplify the planning process. By incorporating
								your course requirements and preferences, Starlite streamlines
								the scheduling process for you, providing you with optimal
								timetable options effortlessly. WGT!
							</Typography>
							<Typography
								color="#88d6e2"
								fontWeight="bold"
								fontSize="30px"
								textAlign="right"
							>
								Maximizing Desirability
							</Typography>
							<Typography
								sx={{
									color: '#5c5959',
									textAlign: 'right',
									marginTop: '10px',
									marginBottom: '40px',
								}}
							>
								Starlite commitment is to deliver timetables that resonate with
								your preferences and priorities. Starlite utilizes intelligent
								algorithms to analyze and prioritize your preferences, resulting
								in timetables that not only meet the academic requirements but
								also enhance your overall NTU experience. Starlite strive to
								maximize the desirability of your timetable, allowing you to
								focus on your studies, pursuits, and personal well-being. Don't
								say bojio!
							</Typography>
							<Typography
								color="#88d6e2"
								fontWeight="bold"
								fontSize="30px"
								textAlign="right"
							>
								Continual Improvement
							</Typography>
							<Typography
								sx={{
									color: '#5c5959',
									textAlign: 'right',
									marginTop: '10px',
								}}
							>
								Starlite is a dynamic platform that evolves with your feedback
								and changing needs. I will try my best to be committed to
								continual improvement of features, incorporating new features
								and enhancements based on your user experiences.
							</Typography>
						</Box>
						<Box
							sx={{
								position: 'sticky',
								top: 'calc(50% - 200px)',
								overflow: 'auto',
								paddingLeft: '20px',
								maxHeight: '470px',
							}}
						>
							<img
								src={selfImage}
								style={{
									width: '480px',
									height: '460px',
								}}
							/>
						</Box>
					</Box>
				</div>
			</div>
			<FeedbackForm />
			<Box sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
				<Typography
					sx={{
						margin: '40px 0',
						color: '#5c5959',
						width: '683px',
					}}
					align="justify"
				>
					Summing it up, it has been a excellent one year project and journey.
					This project taught me almost from zero to advance frontend frameworks
					and best practices for React, TypeScript and all the complex
					hooks/libraries there is. I hope that Starlite will be a
					Quality-of-Life improvement for future NTU students when it comes to
					mapping courses. If you have any improvements or suggestions please
					feel free to drop me any feedback!! Your insights are invaluable, and
					it will aid in shaping the future of timetable planning at NTU. Cheers
					and all the best for your future endeavor.
				</Typography>
			</Box>
		</section>
	)
}

export default About

// Motivation Statement for Starlite: Revolutionizing Timetable Planning at NTU

// Dear NTU Students,

// I am thrilled to introduce Starlite, a groundbreaking platform designed to transform the way we approach timetable planning and preferences at Nanyang Technological University. Starlite emerges from a deep understanding of the challenges students face in curating their schedules, aligning with their academic goals and personal preferences.

// Empowering Student Choice:
// Starlite is driven by the belief that every student's journey at NTU should be characterized by flexibility and empowerment. We understand that each student has unique preferences, academic pursuits, and personal commitments. Starlite empowers you to take control of your timetable, ensuring that it not only meets academic requirements but aligns seamlessly with your lifestyle and personal goals.

// Efficiency through Automation:
// Gone are the days of manually navigating through countless timetable combinations. Starlite employs cutting-edge automation to simplify the planning process. By incorporating your preferences, course requirements, and extracurricular commitments, Starlite streamlines the scheduling process, providing you with optimal timetable options effortlessly.

// Maximizing Desirability:
// Our commitment is to deliver timetables that resonate with your preferences and priorities. Starlite utilizes intelligent algorithms to analyze and prioritize your preferences, resulting in timetables that not only meet the academic requirements but also enhance your overall NTU experience. We strive to maximize the desirability of your timetable, allowing you to focus on your studies, pursuits, and personal well-being.

// Continual Improvement:
// Starlite is a dynamic platform that evolves with your feedback and changing needs. We are committed to continual improvement, incorporating new features and enhancements based on user experiences. Your insights are invaluable, shaping the future of timetable planning at NTU.

// As we embark on this journey together, Starlite aims to redefine the way you engage with your academic life. Our mission is to empower you, the NTU student community, to make the most of your time on campus, ensuring that your timetable is not just a schedule but a reflection of your aspirations.

// Welcome to Starlite, where your timetable becomes a personalized roadmap to success.

// Sincerely,

// [Your Name]
// Founder, Starlite Platform
