export function awaitPromise(promFact: () => Promise<any>): (done) => void {
  return done => {
    promFact().then(done, err => fail(err));
  }
}