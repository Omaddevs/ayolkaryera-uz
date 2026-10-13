import TopCompanies from '../TopCompanies/TopCompanies.jsx'
import JobListings from '../JobListings/JobListings.jsx'
import AdSidebar from '../AdSidebar/AdSidebar.jsx'
import './HomeFeed.css'

export default function HomeFeed() {
  return (
    <section className="home-feed container" id="ishlar">
      <div className="home-feed__grid">
        <aside className="home-feed__col home-feed__col--companies" id="kompaniyalar">
          <TopCompanies embedded />
        </aside>

        <div className="home-feed__col home-feed__col--jobs">
          <JobListings embedded />
        </div>

        <aside className="home-feed__col home-feed__col--ads">
          <AdSidebar />
        </aside>
      </div>
    </section>
  )
}
