import { PelicanPosPage } from './app.po';

describe('pelican-pos App', function() {
  let page: PelicanPosPage;

  beforeEach(() => {
    page = new PelicanPosPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
