import { Link } from 'react-router-dom';
import Header from './header'
import Footer from './footer'
import'./globals2.css'
export default function Component() {
  return (
    <>
   <div  class="body1">
    <Header></Header>
    <main class="main-content1">
      <div class="main-text1">
        <h1>Test Your Knowledge with QuizMaster</h1>
        <p>Test your knowledge, challenge your friends, and climb the leaderboard. Explore a wide range of quiz categories and difficulty levels.</p>
        <div class="main-buttons1">
      
          <Link to="/signin" className="btn view-leaderboard">Sign In</Link>
            <Link to="/signup" className="btn start-quiz">Sign Up</Link>
        </div>
      </div>
    </main>
    <Footer></Footer>
    </div>
  </>
  )
}
