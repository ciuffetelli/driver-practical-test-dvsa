(async () => {

    // state = {
    //     driverLicenceNumber: "1234567890",
    //     extendedTest: false,
    //     specialNeeds: false,
    //     testDate: "2021-01-01",
    //     intructorName: "John Doe",
    //     testCentre: "Test Centre"
    // }

    chrome.storage?.sync.get(['DLN_STATE'], (result) => {

        const state = result.DLN_STATE;

        console.log(state);
    
        const jorney = document.querySelector('[data-journey]')?.getAttribute('data-journey');

        switch (jorney) {
            case 'pp-book-practical-driving-test-public:enter-licence-details':

            document.querySelector('#driving-licence') && (document.querySelector('#driving-licence').value = state?.driverLicenceNumber ?? '');

                state?.extendedTest === true ?  
                    document.querySelector('#extended-test-yes')?.setAttribute('checked', 'checked') :
                    document.querySelector('#extended-test-no')?.setAttribute('checked', 'checked');

                state?.specialNeeds === true ?
                    document.querySelector('#special-needs-add')?.setAttribute('checked', 'checked') :
                    document.querySelector('#special-needs-none')?.setAttribute('checked', 'checked');

                document.querySelector('#driving-licence-submit')?.addEventListener('mouseover', () => {
                    saveState(state, {
                        driverLicenceNumber: document.querySelector('#driving-licence')?.value,
                        extendedTest: document.querySelector('[for="extended-test-yes"]')?.classList.contains('checked'),
                        specialNeeds: document.querySelector('[for="special-needs-add"]')?.classList.contains('checked')
                    });
                });

                state?.driverLicenceNumber && document.querySelector('#driving-licence-submit')?.classList.remove('cta-lookdisabled');
            
            break;
            case 'pp-book-practical-driving-test-public:choose-date-and-time':

                document.querySelector('#test-choice-calendar') && (document.querySelector('#test-choice-calendar').value = state?.testDate ?? '');
                document.querySelector('#instructor-prn') && (document.querySelector('#instructor-prn').value = state?.intructorName ?? '');

                document.querySelector('#driving-licence-submit')?.addEventListener('mouseover', () => {
                    saveState(state, {
                        testDate: document.querySelector('#test-choice-calendar')?.value,
                        intructorName: document.querySelector('#instructor-prn')?.value
                    });
                });
            break;
            case 'pp-book-practical-driving-test-public:choose-test-centre':

                document.querySelector('#test-centres-input') && (document.querySelector('#test-centres-input').value = state?.testCentre ?? '');

                document.querySelector('#test-centres-submit')?.addEventListener('mouseover', () => {
                    saveState(state, {
                        testCentre: document.querySelector('#test-centres-input')?.value,
                    });
                });
                
                const inverval = setTimeout(() => {
                    document.querySelector('#test-centres-submit')?.click();
                }, 60000)

                const bookfound = Array.from(document.querySelectorAll('.test-centre-details h5')).filter(item => (item.innerText.search('No tests found on any date') === -1));

                if (bookfound.length > 0) {
                    clearTimeout(inverval);

                    const beepElement = document.createElement('audio');
                    beepElement.setAttribute('src', 'https://bigsoundbank.com/UPLOAD/mp3/1417.mp3?v=m');
                    beepElement.setAttribute('autoplay', 'autoplay');

                    bookfound.map(item => {
                        item.style.color = 'red';
                    })
                }
                
            break;
        }
    });
})();

function saveState(state, newData) {
    chrome.storage?.sync.set({ DLN_STATE: {
        ...state,
        ...newData
    }}, () => {
        console.log('saved');
    });    
}