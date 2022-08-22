async function searchByKeyword(page, keyword_search){
    await page.locator('[data-testid="txt-SearchBar"]').type(keyword_search, {delay:500});     
    await page.locator('[data-testid="txt-SearchBar"]').press('Enter');
}

async function inputKeyword(page, keyword_search){
    await page.locator('[data-testid="txt-SearchBar"]').type(keyword_search, {delay:500});         
}

module.exports = {
    searchByKeyword,
    inputKeyword    
};