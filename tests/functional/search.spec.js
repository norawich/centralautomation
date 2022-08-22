const { test, expect } = require('@playwright/test');
const { searchByKeyword, inputKeyword } = require('../../pages/homepage');


test.beforeEach(async ({ page}) => {   
    await page.goto('/en/search');
});


test.describe('@search feature on homepage', () => {

    test('To verify search suggestion display 4 keyword results in categories section', async({page})=>{                          
       const keyword_search = 'Acer';       
       await inputKeyword(page, keyword_search);

       const [category_totalrow] = await Promise.all([
            page.locator('div._3vuaX._1fVgu > div > div:nth-child(2) >> div ').count()
       ]);           
       await expect(category_totalrow).toEqual(4);
    });

    test('To verify search suggestion displays 6 keyword results in Products section', async({page})=>{                          
        const keyword_search = 'mitsubishi';

        await inputKeyword(page, keyword_search);
        const [product_totalrow] = await Promise.all([
             page.locator(`text=${keyword_search}`).count()
        ]);
        await expect(product_totalrow).toEqual(6);
     });

     test('To verify search suggestion constains search terms on keyword', async({page})=>{                          
        const keyword_search = 'hittop'; 
        await inputKeyword(page, keyword_search);
        await expect(page.locator('text=Search terms')).toBeVisible();
     });
 

     test('To verify user is able to search by brand in keyword', async({page})=>{                          
        const keyword_search = 'eve'; 
        await searchByKeyword(page, keyword_search);
        await page.locator(`div:nth-child(1) >> [data-product-section="Search Results/${keyword_search}"]`).nth(1).click();
        //To check if the brand of 1st product is EVE
        await expect(page.locator('[data-testid="pnl-productHeader"] span:has-text("EVE")')).toBeVisible();
     });

     test('To verify the search is able to support Thai keyword', async({page})=>{                          
        const keyword_search = 'ญี่ปุ่นขึ้นเมือง'; 
        await searchByKeyword(page, keyword_search);
        const [result] = await Promise.all([
            page.locator(`div:nth-child(1) >> [data-product-section="Search Results/${keyword_search}"]`).nth(1).innerText()
        ]);
        await expect(result).toContain(keyword_search);
     });

     test('To verify the search is able to support SKU keyword', async({page}) =>{
        const keyword_search = 'MKP1070032';
        await searchByKeyword(page, keyword_search);
        const [result] = await Promise.all([
            page.locator(`[data-testid="pnl-productPreview"] >> text=${keyword_search}`).innerText()
        ]);
        await expect(result).toContain(keyword_search);
     })

    test('To verify the search is able to support multiple SKU keyword', async({page}) =>{
        const keyword_search = 'OFMY011652, MKP1070032';
        await searchByKeyword(page, keyword_search);
        await page.waitForTimeout(1000);        

        const result = await Promise.all([
            page.locator('div:nth-child(1) > div.POZxw').nth(0).innerText(),
            page.locator('div:nth-child(1) > div.POZxw').nth(1).innerText()
        ]);               
        console.log(result);        
        await expect(result.at(0)).toEqual('OFMY011652');
        await expect(result.at(1)).toEqual('MKP1070032');
     })

     test('To verify the search keyword not found should return the proper handling message', async({page})=>{
        const keyword_search = 'epicseven';
        const sorry_message = 'text=/.*Sorry, there is no product matched "epicseven".*/';
        const spelling_message = 'text=Please check your spelling or try with other keywords';
        
        await searchByKeyword(page, keyword_search);        
        await expect(page.locator(sorry_message)).toBeVisible();
        await expect(page.locator(spelling_message)).toBeVisible();
     })

     test('To verify the search keyword with special character should return the proper handling message', async({page}) =>{
        const keyword_search = '~!@#$%^&*()';
        const sorry_message = 'text=Sorry, there is no product matched "~!@#$%^&*()"';
        const spelling_message = 'text=Please check your spelling or try with other keywords';
        
        await searchByKeyword(page, keyword_search);         
        await expect(page.locator(sorry_message)).toBeVisible();
        await expect(page.locator(spelling_message)).toBeVisible();
     })

     test('To verify user is able to select the categories that keyword search is belongs to', async({page})=>{                          
        const keyword_search = 'Acer';
        const category = 'in Laptop';
        await inputKeyword(page, keyword_search);
        await page.locator(`text=${category}`).click();            
        const [response] = await Promise.all([
            page.locator('#txt-subCategories-name').innerText()
        ])
        await expect(response).toEqual('Laptop');
     });

});