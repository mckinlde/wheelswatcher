import React from 'react';

export const AboutPage = () => {
  return (
    <div className="container p-4 text-left">
      <header className="App-header mb-6">
        <div className="intro-box my-4">
          <p>
            <strong>CarSaleSignal:</strong> the automotive MLS that gives small dealerships
            and individual buyers an unfair information advantage over big players like KBB and Penske.
          </p>
        </div>

        <h2 className="text-xl font-semibold mt-6">What is it</h2>
        <br />
        <p>
          CarSaleSignal is a database of all the used car listings in America that get taken down
          and marked as sold by the author of the listing.
        </p>

        <h2 className="text-xl font-semibold mt-6">How does it work</h2>
        <br />
        <p>
          CarSaleSignal works from a distributed system of computers in the cloud:
        </p>

        <div className="text-center my-4">
          <img
            src={`${process.env.PUBLIC_URL}/ezgif.com-gif-maker.gif`}
            alt="System architecture gif"
            className="max-w-full rounded"
          />
        </div>

        <p>
          (fancy words because I use this on my resume; it's just this running on a bunch of copies that I rent from Jeff Bezos.)
        </p>

        <br />

        <p>
          Collectively, they read all of Craigslist every night. When a new listing is posted, it
          gets saved to the database along with the time it was posted. When a listing gets removed
          by the seller (without expiring or being flagged as a scam), the database gets updated
          with the time that listing was removed.
        </p>

        <h2 className="text-xl font-semibold mt-6">Why bother?</h2>
        <br />
        <p>
          Because trying to figure out whether or not something is a good deal is frustrating!
          Trade-in values all suck, and nobody trusts KBB — with good reason. We all took 6th grade
          math, and when you don't show your work you don't get credit.
        </p>
        <p>
          That's why I built CarSaleSignal — to show you the data, so you can make your own informed
          decisions.
        </p>
      </header>

      <footer style={{ marginTop: '2rem' }}>
        <p>
          Contact: <a className="App-link" href="mailto:cadocary@gmail.com">cadocary@gmail.com</a>
        </p>
      </footer>
    </div>
  );
};
