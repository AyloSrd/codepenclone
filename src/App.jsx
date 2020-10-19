import React from 'react'
import ProfessorsDesk from './ProfessorsDesk'
import StudentsDesk from './StudentsDesk'
import { 
	BrowserRouter as Router,
	Switch,
	Route,
	Link 
	} from 'react-router-dom'

const App = () => {
	return (
		<Router>
			<div>
				<nav>
				<ul>
					<li>
					<Link to="/student">Student</Link>
					</li>
					<li>
					<Link to="/prof">Prof</Link>
					</li>
				</ul>
				</nav>

				{/* A <Switch> looks through its children <Route>s and
					renders the first one that matches the current URL. */}
				<Switch>
				<Route path="/student">
					<StudentsDesk />
				</Route>
				<Route path="/prof">
					<ProfessorsDesk />
				</Route>
				</Switch>
			</div>
		</Router>
	)
}

export default App
