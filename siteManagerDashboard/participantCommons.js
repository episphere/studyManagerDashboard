import { renderParticipantDetails } from './participantDetails.js';
import { animation } from './index.js'
import fieldMapping from './fieldToConceptIdMapping.js'; 
import { keyToNameObj } from './siteKeysToName.js';
export const importantColumns = [fieldMapping.fName, fieldMapping.mName, fieldMapping.lName, fieldMapping.birthMonth, fieldMapping.birthDay, fieldMapping.birthYear, fieldMapping.email, 'Connect_ID', fieldMapping.healthcareProvider];
import { getAccessToken, getDataAttributes, showAnimation, hideAnimation, baseAPI  } from './utils.js';
import { findParticipant } from './participantLookup.js';
import { nameToKeyObj } from './siteKeysToName.js';

export const renderTable = (data, source) => {
    let template = '';
    if(data.length === 0) return `No data found!`;
    let array = [ 'Connect_ID', 'pin', 'token', 'studyId', fieldMapping.timeStudyIdSubmitted, fieldMapping.recruitmentType, fieldMapping.recruitmentDate, fieldMapping.siteReportedAge, fieldMapping.siteReportedRace, 
    fieldMapping.siteReportedSex, fieldMapping.sanfordReportedSex, fieldMapping.sanfordReportedRace, fieldMapping.campaignType, fieldMapping.signedInFlag, fieldMapping.signinDate, fieldMapping.pinEntered, fieldMapping.noPin, fieldMapping.consentFlag, 
    fieldMapping.consentDate, fieldMapping.consentVersion, fieldMapping.hippaFlag, fieldMapping.hippaDate, fieldMapping.hippaVersion, fieldMapping.userProfileFlag, 
    fieldMapping.userProfileDateTime, fieldMapping.verifiedFlag, fieldMapping.verficationDate, fieldMapping.automatedVerification, fieldMapping.outreachRequiredForVerification, fieldMapping.manualVerification,
    fieldMapping.duplicateType, fieldMapping.firstNameMatch, fieldMapping.lastNameMatch, fieldMapping.dobMatch, fieldMapping.pinMatch, fieldMapping.tokenMatch, 
    fieldMapping.zipCodeMatch, fieldMapping.siteMatch, fieldMapping.ageMatch, fieldMapping.cancerStatusMatch, fieldMapping.updateRecruitType, 
    fieldMapping.preConsentOptOut, fieldMapping.datePreConsentOptOut, fieldMapping.maxNumContactsReached, fieldMapping.signInMechansim, fieldMapping.consentFirstName, 
    fieldMapping.consentMiddleName, fieldMapping.consentLastName, fieldMapping.accountName,fieldMapping.accountPhone, fieldMapping.accountEmail, fieldMapping.prefName, 
    fieldMapping.address1, fieldMapping.address2, fieldMapping.city, fieldMapping.state, fieldMapping.zip, fieldMapping.prefEmail, fieldMapping.email, fieldMapping.email1, 
    fieldMapping.email2, fieldMapping.cellPhone, fieldMapping.homePhone, fieldMapping.otherPhone, fieldMapping.previousCancer, fieldMapping.allBaselineSurveysCompleted, 
    fieldMapping.participationStatus, /* fieldMapping.enrollmentStatus, */ fieldMapping.bohStatusFlag1, fieldMapping.mreStatusFlag1, fieldMapping.sasStatusFlag1, fieldMapping.lawStausFlag1, 
    fieldMapping.ssnFullflag, fieldMapping.ssnPartialFlag , fieldMapping.refusedSurvey,  fieldMapping.refusedBlood, fieldMapping.refusedUrine,  fieldMapping.refusedMouthwash, fieldMapping.refusedSpecimenSurevys, fieldMapping.refusedFutureSamples, 
    fieldMapping.refusedFutureSurveys, fieldMapping.refusedAllFutureActivities, fieldMapping.revokeHIPAA, fieldMapping.dateHipaaRevokeRequested, fieldMapping.dateHIPAARevoc, fieldMapping.withdrawConsent, fieldMapping.dateWithdrewConsentRequested, 
    fieldMapping.participantDeceased, fieldMapping.dateOfDeath, fieldMapping.destroyData, fieldMapping.dateDataDestroyRequested, fieldMapping.dateDataDestroy, fieldMapping.suspendContact
 ];
    localStorage.removeItem("participant");
    let conceptIdMapping = JSON.parse(localStorage.getItem('conceptIdMapping'));
    if(array.length > 0) {
        template += `<div class="row">
            <div class="col" id="columnFilter">
                ${array.map(x => `<button name="column-filter" class="filter-btn sub-div-shadow" data-column="${x}">${conceptIdMapping[x] && conceptIdMapping[x] ? 
                    ((x !== fieldMapping.refusedSpecimenSurevys && x !== fieldMapping.dateHipaaRevokeRequested) ? 
                        conceptIdMapping[x]['Variable Label'] || conceptIdMapping[x]['Variable Name'] : getCustomVariableNames(x)) : x}</button>`)}
            </div>
        </div>`
    }
    template += ` <div id="alert_placeholder"></div>
                    <div class="row">
                    ${(source === 'participantAll') ? ` 
                    <span style="padding-left: 20px;"></span>  
                    <div class="form-group dropdown" id="siteDropdownLookup" hidden>
                    <button class="btn btn-primary btn-lg dropdown-toggle" type="button" id="dropdownSites" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        Filter by Site
                    </button>
                    <ul class="dropdown-menu" id="dropdownMenuButtonSites" aria-labelledby="dropdownMenuButton">
                        <li><a class="dropdown-item" data-siteKey="allResults" id="all">All</a></li>
                        <li><a class="dropdown-item" data-siteKey="hfHealth" id="hfHealth">Henry Ford Health Systems</a></li>
                        <li><a class="dropdown-item" data-siteKey="hPartners" id="hPartners">HealthPartners</a></li>
                        <li><a class="dropdown-item" data-siteKey="kpGA" id="kpGA">KP GA</a></li>
                        <li><a class="dropdown-item" data-siteKey="kpHI" id="kpHI">KP HI</a></li>
                        <li><a class="dropdown-item" data-siteKey="kpNW" id="kpNW">KP NW</a></li>
                        <li><a class="dropdown-item" data-siteKey="kpCO" id="kpCO">KP CO</a></li>
                        <li><a class="dropdown-item" data-siteKey="maClinic" id="maClinic">Marshfield Clinic</a></li>
                        <li><a class="dropdown-item" data-siteKey="nci" id="nci">NCI</a></li>
                        <li><a class="dropdown-item" data-siteKey="snfrdHealth" id="snfrdHealth">Sanford Health</a></li>
                        <li><a class="dropdown-item" data-siteKey="uChiM" id="uChiM">UofC Medicine</a></li>
                    </ul>
                </div>`: ``} </div>`

    let backToSearch = (source === 'participantLookup')? `<button class="btn btn-primary" id="back-to-search">Back to Search</button>`: "";
    template += `
                <div class="row">
                    <div class="col">
                        <div class="float-left">
                            ${backToSearch}
                        </div>
                        <div class="float-right" style="display: none">
                            <input id="filterData" class="form-control sub-div-shadow" type="text" placeholder="Min. 3 characters" disabled><span data-toggle="tooltip" title='Search by first name, last name or connect id' class="fas fa-search search-icon"></span></div>
                        </div> 
                    </div>
                <div class="row allow-overflow">
                    <div class="col sticky-header">
                        <table id="dataTable" class="table table-hover table-bordered table-borderless sub-div-shadow no-wrap"></table>
                        <div id="paginationContainer"></div>
                    </div>
                    <div class="modal fade" id="modalShowMoreData" data-keyboard="false" data-backdrop="static" tabindex="-1" role="dialog" data-backdrop="static" aria-hidden="true">
                        <div class="modal-dialog modal-lg modal-dialog-centered" role="document">
                            <div class="modal-content sub-div-shadow">
                                <div class="modal-header" id="modalHeader"></div>
                                <div class="modal-body" id="modalBody"></div>
                            </div>
                        </div>
                    </div>
                </div>`
    return template;
}


export  const renderData = (data, showButtons) => {
    if(data.length === 0) {
        const mainContent = document.getElementById('mainContent');
        mainContent.innerHTML = renderTable(data);
        animation(false);
        return;
    }
    const pageSize = 10;
    const dataLength = data.length;
    const pages = Math.ceil(dataLength/pageSize);
    const array = [];

    for(let i = 0; i< pages; i++){
        array.push(i+1);
    }
    document.getElementById('paginationContainer').innerHTML = paginationTemplate(array);
    addEventPageBtns(pageSize, data, showButtons);

    document.getElementById('dataTable').innerHTML = tableTemplate(dataPagination(0, pageSize, data), showButtons);
    addEventShowMoreInfo(data);
}

const addEventPageBtns = (pageSize, data, showButtons) => {
    const elements = document.getElementsByClassName('page-link');
    Array.from(elements).forEach(element => {
        element.addEventListener('click', async () => {
            const previous = element.dataset.previous;
            const next = element.dataset.next;
            const pageNumber = previous ? parseInt(previous) - 1 : next ? parseInt(next) + 1 : element.dataset.page;
            
            if(pageNumber < 1 || pageNumber > Math.ceil(data.length/pageSize)) return;
            
            if(!element.classList.contains('active-page')){
                let start = (pageNumber - 1) * pageSize;
                let end = pageNumber * pageSize;
                document.getElementById('previousPage').dataset.previous = pageNumber;
                document.getElementById('nextPage').dataset.next = pageNumber;
                document.getElementById('dataTable').innerHTML = tableTemplate(dataPagination(start, end, data), showButtons);
                addEventShowMoreInfo(data);
                Array.from(elements).forEach(ele => ele.classList.remove('active-page'));
                document.querySelector(`a[data-page="${pageNumber}"]`).classList.add('active-page');
            }
        })
    });
}



const dataPagination = (start, end, data) => {
    const paginatedData = [];
    for(let i=start; i<end; i++){
        if(data[i]) paginatedData.push(data[i]);
    }
    return paginatedData;
}

const paginationTemplate = (array) => {
    let template = `
        <nav aria-label="Page navigation example">
            <ul class="pagination">`
    
    array.forEach((a,i) => {
        if(i === 0){
            template += `<li class="page-item">
                            <a class="page-link" id="previousPage" data-previous="1" aria-label="Previous">
                            <span aria-hidden="true">&laquo;</span>
                            <span class="sr-only">Previous</span>
                            </a>
                        </li>`
        }
        template += `<li class="page-item"><a class="page-link ${i === 0 ? 'active-page':''}" data-page=${a}>${a}</a></li>`;

        if(i === (array.length - 1)){
            template += `
            <li class="page-item">
                <a class="page-link" id="nextPage" data-next="1" aria-label="Next">
                <span aria-hidden="true">&raquo;</span>
                <span class="sr-only">Next</span>
                </a>
            </li>`
        }
    });
    template += `
            </ul>
        </nav>
    `;
    return template;
}

// TODO: needs code refactoring
const tableTemplate = (data, showButtons) => {
    let template = '';
    let conceptIdMapping = JSON.parse(localStorage.getItem('conceptIdMapping'));
    template += `<thead class="thead-dark sticky-row"><tr><th class="sticky-row">Select</th>`
    importantColumns.forEach(x => template += `<th class="sticky-row">${conceptIdMapping[x] && conceptIdMapping[x] ? conceptIdMapping[x]['Variable Label'] || conceptIdMapping[x]['Variable Name']: x}</th>`)
    template += `
        </tr>
    </thead>`;
    data.forEach(participant => {
        // mapping from concept id to variable name
        template += `<tbody><tr><td><button class="btn btn-primary select-participant" data-token="${participant.token}">Select</button></td>`
        importantColumns.forEach(x => {
            (participant[x] && typeof participant[x] === 'object') ?
                (template += `<td><pre>${JSON.stringify(participant[x], undefined, 4)}</pre></td>`)
            : 
            ( keyToNameObj[participant[x]] && keyToNameObj[participant[x]] !== undefined && x === fieldMapping.healthcareProvider ) ? 
               ( template += `<td>${keyToNameObj[participant[x]] ? keyToNameObj[participant[x]] : ''}</td>`)
            : (participant[x] && participant[x] === fieldMapping.no) ?
               ( template += `<td>${participant[x] ? 'No' : ''}</td>` )
            : (participant[x] && participant[x] === fieldMapping.yes) ?
               ( template += `<td>${participant[x] ? 'Yes' : ''}</td>` )
            : (participant[x] && participant[x] === fieldMapping.active) ?
               ( template += `<td>${participant[x] ? 'Active' : ''}</td>` )
            : (participant[x] && participant[x] === fieldMapping.passive) ?
                ( template += `<td>${participant[x] ? 'Passive' : ''}</td>`)
            : (participant[x] && participant[x] === fieldMapping.inactive) ?
                ( template += `<td>${participant[x] ? 'Not active' : ''}</td>`)
            : (participant[x] && participant[x] === fieldMapping.prefPhone) ?
               ( template += `<td>${participant[x] ? 'Text Message' : ''}</td>` )
            : (participant[x] && participant[x] === fieldMapping.prefEmail) ?
               ( template += `<td>${participant[x] ? 'Email' : ''}</td>` )
            : ((x === (fieldMapping.signinDate).toString()) || (x === (fieldMapping.userProfileDateTime).toString()) || (x === (fieldMapping.consentDate).toString())
             || (x === (fieldMapping.recruitmentDate).toString()) || (x === (fieldMapping.verficationDate).toString())) ? 
               ( template += `<td>${participant[x] ? new Date(participant[x]).toLocaleString() : ''}</td>`) // human readable time date
            : (x === (fieldMapping.verifiedFlag).toString()) ?
            (
                (participant[x] === fieldMapping.notYetVerified) ?
                    template += `<td>${participant[x] ? 'Not Yet Verified'  : ''}</td>`
                : (participant[x] === fieldMapping.outreachTimedout) ?
                    template += `<td>${participant[x] ? 'Out Reach Timed Out'  : ''}</td>`
                : (participant[x] === fieldMapping.verified) ?
                    template += `<td>${participant[x] ? 'Verified'  : ''}</td>`
                : (participant[x] === fieldMapping.cannotBeVerified) ?
                    template += `<td>${participant[x] ? 'Can Not Be Verified '  : ''}</td>`
                : (
                    template += `<td>${participant[x] ? 'Duplicate'  : ''}</td>` )
            )
            : (x === (fieldMapping.participationStatus).toString()) ?
            (
                (participant[x] === fieldMapping.noRefusal) ?
                    template += `<td>${participant[x] ? 'No Refusal'  : ''}</td>`
                : (participant[x] === fieldMapping.refusedSome) ?
                    template += `<td>${participant[x] ? 'Refused Some'  : ''}</td>`
                : (participant[x] === fieldMapping.refusedAll) ?
                    template += `<td>${participant[x] ? 'Refused All'  : ''}</td>`
                : (participant[x] === fieldMapping.revokeHIPAAOnly) ?
                    template += `<td>${participant[x] ? 'Revoke HIPAA Only'  : ''}</td>`
                : (participant[x] === fieldMapping.withdrewConsent) ?
                template += `<td>${participant[x] ? 'Withdrew Consent'  : ''}</td>`
                : (participant[x] === fieldMapping.destroyDataStatus) ?
                template += `<td>${participant[x] ? 'Destroy Data Status'  : ''}</td>`
                : (participant[x] === fieldMapping.deceased) ?
                    template += `<td>${participant[x] ? 'Deceased'  : ''}</td>` 
                : template += `<td> ERROR </td>`
            )
            : (x === (fieldMapping.bohStatusFlag1).toString() || x === (fieldMapping.mreStatusFlag1).toString() 
            || x === (fieldMapping.lawStausFlag1).toString() || x === (fieldMapping.sasStatusFlag1).toString()) ?
            (
                (participant[x] === fieldMapping.submitted1) ?
                ( template += `<td>${participant[x] ? 'Submitted'  : ''}</td>` )
                : (participant[x] === fieldMapping.started1) ?
                (template += `<td>${participant[x] ? 'Started'  : ''}</td>` )
                : (template += `<td>${participant[x] ? 'Not Started'  : ''}</td>` )
            )
            :  (x === (fieldMapping.refusedSurvey).toString() || x === (fieldMapping.refusedBlood).toString() || x === (fieldMapping.refusedUrine).toString() ||
                x === (fieldMapping.refusedMouthwash).toString() || x === (fieldMapping.refusedSpecimenSurevys).toString() || x === (fieldMapping.refusedFutureSamples).toString() || 
                x === (fieldMapping.refusedFutureSurveys).toString() || x === (fieldMapping.refusedAllFutureActivities).toString()) ?
            (
                (participant[fieldMapping.refusalOptions][x] === fieldMapping.yes ?
                    ( template += `<td>${participant[fieldMapping.refusalOptions][x] ? 'Yes'  : ''}</td>` )
                    :
                    ( template += `<td>${participant[fieldMapping.refusalOptions][x] ? 'No'  : ''}</td>` )
                )
            )
            : (x === 'studyId') ? (template += `<td>${participant['state']['studyId'] ? participant['state']['studyId'] : ``}</td>`)
            : (x === fieldMapping.siteReportedAge.toString()) ? 
            (
                ( participant['state'][fieldMapping.siteReportedAge.toString()] === fieldMapping.ageRange1 ) ?
                    template += `<td>${participant['state'][fieldMapping.siteReportedAge.toString()] ? `40-45` : ``}</td>`
                :   ( participant['state'][fieldMapping.siteReportedAge.toString()] === fieldMapping.ageRange2 ) ?
                    template += `<td>${participant['state'][fieldMapping.siteReportedAge.toString()] ? `46-50` : ``}</td>`
                :   ( participant['state'][fieldMapping.siteReportedAge.toString()] === fieldMapping.ageRange3 ) ?
                    template += `<td>${participant['state'][fieldMapping.siteReportedAge.toString()] ? `51-55` : ``}</td>`
                :   ( participant['state'][fieldMapping.siteReportedAge.toString()] === fieldMapping.ageRange4 ) ?
                    template += `<td>${participant['state'][fieldMapping.siteReportedAge.toString()] ? `56-60` : ``}</td>`
                :   ( participant['state'][fieldMapping.siteReportedAge.toString()] === fieldMapping.ageRange5 ) ?
                    template += `<td>${participant['state'][fieldMapping.siteReportedAge.toString()] ? `61-65` : ``}</td>`
                :   (
                    template += `<td>${participant['state'][fieldMapping.siteReportedAge.toString()] ? `ERROR` : ``}</td>`)
                )
            : (x === fieldMapping.siteReportedSex.toString()  ) ? (
            (  
                ( participant['state'][fieldMapping.siteReportedSex.toString()] === fieldMapping.female ) ?
                template += `<td>${participant['state'][fieldMapping.siteReportedAge.toString()] ? `Female` : ``}</td>`
                :   ( participant['state'][fieldMapping.siteReportedSex.toString()] === fieldMapping.male ) ?
                    template += `<td>${participant['state'][fieldMapping.siteReportedAge.toString()] ? `Male` : ``}</td>`
                :   ( participant['state'][fieldMapping.siteReportedSex.toString()] === fieldMapping.intersex ) ?
                    template += `<td>${participant['state'][fieldMapping.siteReportedAge.toString()] ? `Intersex` : ``}</td>`
                :
                    template += `<td>${participant['state'][fieldMapping.siteReportedSex.toString()] ? `Unavailable/Unknown` : ``}</td>`)
                )
            : (x === fieldMapping.sanfordReportedSex.toString()  ) ? (
                (  
                    ( participant['state'][fieldMapping.sanfordReportedSex.toString()] === fieldMapping.female ) ?
                    template += `<td>${participant['state'][fieldMapping.sanfordReportedSex.toString()] ? `Female` : ``}</td>`
                    :   ( participant['state'][fieldMapping.sanfordReportedSex.toString()] === fieldMapping.male ) ?
                        template += `<td>${participant['state'][fieldMapping.sanfordReportedSex.toString()] ? `Male` : ``}</td>`
                    :
                        template += `<td>${participant['state'][fieldMapping.sanfordReportedSex.toString()] ? `Unavailable/Unknown` : ``}</td>`)
                    )
            : (x === fieldMapping.siteReportedRace.toString()) ? (
                (  
                    ( participant['state'][fieldMapping.siteReportedRace.toString()] === fieldMapping.white ) ?
                    template += `<td>${participant['state'][fieldMapping.siteReportedRace.toString()] ? `White` : ``}</td>`
                    :   ( participant['state'][fieldMapping.siteReportedRace.toString()] === fieldMapping.other ) ?
                        template += `<td>${participant['state'][fieldMapping.siteReportedRace.toString()] ? `Other` : ``}</td>`
                    :
                        template += `<td>${participant['state'][fieldMapping.siteReportedSex.toString()] ? `Unavailable/Unknown` : ``}</td>`)
                    )
            : (x === fieldMapping.sanfordReportedRace.toString()) ? (
                (  
                    ( participant['state'][fieldMapping.sanfordReportedRace.toString()] === fieldMapping.africanAmericanSH ) ?
                    template += `<td>${participant['state'][fieldMapping.sanfordReportedRace.toString()] ? `African American` : ``}</td>`
                    :   ( participant['state'][fieldMapping.sanfordReportedRace.toString()] === fieldMapping.americanIndianSH ) ?
                        template += `<td>${participant['state'][fieldMapping.sanfordReportedRace.toString()] ? `American Indian or Alaskan Native` : ``}</td>`
                        :   ( participant['state'][fieldMapping.sanfordReportedRace.toString()] === fieldMapping.asianSH ) ?
                        template += `<td>${participant['state'][fieldMapping.sanfordReportedRace.toString()] ? `Asian` : ``}</td>`
                        :   ( participant['state'][fieldMapping.sanfordReportedRace.toString()] === fieldMapping.whiteSH ) ?
                        template += `<td>${participant['state'][fieldMapping.sanfordReportedRace.toString()] ? `Caucasian/White` : ``}</td>`
                        :   ( participant['state'][fieldMapping.sanfordReportedRace.toString()] === fieldMapping.hispanicLBSH ) ?
                        template += `<td>${participant['state'][fieldMapping.sanfordReportedRace.toString()] ? `Hispanic/Latino/Black` : ``}</td>`
                        :   ( participant['state'][fieldMapping.sanfordReportedRace.toString()] === fieldMapping.hispanicLDSH ) ?
                        template += `<td>${participant['state'][fieldMapping.sanfordReportedRace.toString()] ? `Hispanic/Latino/Declined` : ``}</td>`
                        :   ( participant['state'][fieldMapping.sanfordReportedRace.toString()] === fieldMapping.hispanicLWSH ) ?
                        template += `<td>${participant['state'][fieldMapping.sanfordReportedRace.toString()] ? `Hispanic/Latino/White` : ``}</td>`
                        :   ( participant['state'][fieldMapping.sanfordReportedRace.toString()] === fieldMapping.nativeHawaiianSH ) ?
                        template += `<td>${participant['state'][fieldMapping.sanfordReportedRace.toString()] ? `Native Hawaiian/Pacific Islander` : ``}</td>`
                        :   ( participant['state'][fieldMapping.sanfordReportedRace.toString()] === fieldMapping.nativeHawaiianPISH ) ?
                        template += `<td>${participant['state'][fieldMapping.sanfordReportedRace.toString()] ? `Pacific Islander` : ``}</td>`
                        :   ( participant['state'][fieldMapping.sanfordReportedRace.toString()] === fieldMapping.blankSH ) ?
                        template += `<td>${participant['state'][fieldMapping.sanfordReportedRace.toString()] ? `Blank` : ``}</td>`
                        :   ( participant['state'][fieldMapping.sanfordReportedRace.toString()] === fieldMapping.declinedSH ) ?
                        template += `<td>${participant['state'][fieldMapping.sanfordReportedRace.toString()] ? `Declined` : ``}</td>`
                    :
                        template += `<td>${participant['state'][fieldMapping.sanfordReportedRace.toString()] ? `Unavailable/Unknown` : ``}</td>`)
                    )
            : (x === fieldMapping.preConsentOptOut.toString()) ? (
                    ( participant['state'][fieldMapping.preConsentOptOut.toString()] === fieldMapping.yes ) ?
                        template += `<td>${participant['state'][fieldMapping.preConsentOptOut.toString()] ? `Yes` : ``}</td>`
                    : template += `<td>${participant['state'][fieldMapping.preConsentOptOut.toString()] ? `No` : ``}</td>`
                    )
            : (x === fieldMapping.maxNumContactsReached.toString()) ? (
                ( participant['state'][fieldMapping.maxNumContactsReached.toString()] === fieldMapping.yes ) ?
                    template += `<td>${participant['state'][fieldMapping.maxNumContactsReached.toString()] ? `Yes` : ``}</td>`
                : template += `<td>${participant['state'][fieldMapping.maxNumContactsReached.toString()] ? `No` : ``}</td>`
                )
            :(x === fieldMapping.studyIdTimeStamp.toString()) ? (
                template += `<td>${participant['state'][fieldMapping.studyIdTimeStamp.toString()] ? participant['state'][fieldMapping.studyIdTimeStamp.toString()] : ``}</td>`
            ) 
            : (x === fieldMapping.campaignType.toString()) ? (
                (  
                    ( participant['state'][fieldMapping.campaignType.toString()] === fieldMapping.random ) ?
                    template += `<td>${participant['state'][fieldMapping.campaignType.toString()] ? `Random` : ``}</td>`
                    :   ( participant['state'][fieldMapping.campaignType.toString()] === fieldMapping.screeningAppointment ) ?
                        template += `<td>${participant['state'][fieldMapping.campaignType.toString()] ? `Screening Appointment` : ``}</td>`
                    :   ( participant['state'][fieldMapping.campaignType.toString()] === fieldMapping.nonScreeningAppointment ) ?
                        template += `<td>${participant['state'][fieldMapping.campaignType.toString()] ? `Non Screening Appointment` : ``}</td>`
                    :  ( participant['state'][fieldMapping.campaignType.toString()] === fieldMapping.demographicGroup ) ?
                            template += `<td>${participant['state'][fieldMapping.campaignType.toString()] ? `Demographic Group` : ``}</td>`
                    :  ( participant['state'][fieldMapping.campaignType.toString()] === fieldMapping.agingOutofStudy ) ?
                        template += `<td>${participant['state'][fieldMapping.campaignType.toString()] ? `Aging Out of Study` : ``}</td>`
                    :  ( participant['state'][fieldMapping.campaignType.toString()] === fieldMapping.geographicGroup ) ?
                        template += `<td>${participant['state'][fieldMapping.campaignType.toString()] ? `Geographic Group` : ``}</td>`
                    :  ( participant['state'][fieldMapping.campaignType.toString()] === fieldMapping.postScreeningAppointment ) ?
                        template += `<td>${participant['state'][fieldMapping.campaignType.toString()] ? `Post Screening Appointment` : ``}</td>`
                    :  ( participant['state'][fieldMapping.campaignType.toString()] === fieldMapping.technologyAdapters ) ?
                        template += `<td>${participant['state'][fieldMapping.campaignType.toString()] ? `Technology Adapters` : ``}</td>`
                    :  ( participant['state'][fieldMapping.campaignType.toString()] === fieldMapping.lowIncomeAreas ) ?
                        template += `<td>${participant['state'][fieldMapping.campaignType.toString()] ? `Low Income Areas/Health Professional Shortage Areas` : ``}</td>`
                    :  ( participant['state'][fieldMapping.campaignType.toString()] === fieldMapping.noneOftheAbove ) ?
                        template += `<td>${participant['state'][fieldMapping.campaignType.toString()] ? `None of the Above` : ``}</td>`
                    :
                        template += `<td>${participant['state'][fieldMapping.campaignType.toString()] ? `Other` : ``}</td>`)
                    )
            : (x === (fieldMapping.enrollmentStatus).toString()) ? 
            (   
                (participant[x] === fieldMapping.signedInEnrollment) ?
                template += `<td>${participant[x] ? 'Signed In'  : ''}</td>`
                : (participant[x] === fieldMapping.consentedEnrollment) ?
                    template += `<td>${participant[x] ? 'Consented'  : ''}</td>`
                : (participant[x] === fieldMapping.userProfileCompleteEnrollment) ?
                    template += `<td>${participant[x] ? 'User Profile Complete'  : ''}</td>`
                : (participant[x] === fieldMapping.verificationCompleteEnrollment) ?
                    template += `<td>${participant[x] ? 'Verification Complete'  : ''}</td>`
                : (participant[x] === fieldMapping.cannotBeVerifiedEnrollment) ?
                template += `<td>${participant[x] ? 'Cannot Be Verified'  : ''}</td>`
                : (participant[x] === fieldMapping.verifiedMimimallyEnrolledEnrollment) ?
                template += `<td>${participant[x] ? 'Verified Mimimally Enrolled'  : ''}</td>`
                : (participant[x] === fieldMapping.fullyEnrolledEnrollment) ?
                    template += `<td>${participant[x] ? 'Fully Enrolled'  : ''}</td>` 
                : template += `<td> ERROR </td>` 
            )
                    // part of state & default value???
            : (x === fieldMapping.automatedVerification.toString()) ? (
                ( participant['state'][fieldMapping.automatedVerification.toString()] === fieldMapping.methodUsed ) ?
                    template += `<td>${participant['state'][fieldMapping.automatedVerification.toString()] ? `Method Used` : ``}</td>`
                :    template += `<td>${participant['state'][fieldMapping.automatedVerification.toString()] ? `Method Not Used` : ``}</td>`            
            )
            : (x === fieldMapping.manualVerification.toString()) ? (
                ( participant['state'][fieldMapping.manualVerification.toString()] === fieldMapping.methodUsed ) ?
                template += `<td>${participant['state'][fieldMapping.manualVerification.toString()] ? `Method Used` : ``}</td>`
                :   template += `<td>${participant['state'][fieldMapping.manualVerification.toString()] ? `Method Not Used` : ``}</td>`
            )
            : (x === fieldMapping.outreachRequiredForVerification.toString()) ? (
                ( participant['state'][fieldMapping.outreachRequiredForVerification.toString()] === fieldMapping.yes ) ?
                    template += `<td>${participant['state'][fieldMapping.outreachRequiredForVerification.toString()] ? `Yes` : ``}</td>`
                :   template += `<td>${participant['state'][fieldMapping.outreachRequiredForVerification.toString()] ? `No` : ``}</td>`
            )
            : (x === fieldMapping.duplicateType.toString()) ? (
                ( participant['state'][fieldMapping.duplicateType.toString()] === fieldMapping.notActiveSignedAsPassive ) ?
                    template += `<td>${participant['state'][fieldMapping.duplicateType.toString()] ? `Not Active recruit signed in as Passive recruit` : ``}</td>`
                : ( participant['state'][fieldMapping.duplicateType.toString()] === fieldMapping.alreadyEnrolled ) ?
                template += `<td>${participant['state'][fieldMapping.duplicateType.toString()] ? `Already Enrolled` : ``}</td>`
                : ( participant['state'][fieldMapping.duplicateType.toString()] === fieldMapping.notActiveSignedAsActive ) ?
                template += `<td>${participant['state'][fieldMapping.duplicateType.toString()] ? `Not Active recruit signed in as Active recruit` : ``}</td>`
                : ( participant['state'][fieldMapping.duplicateType.toString()] === fieldMapping.passiveSignedAsActive ) ?
                template += `<td>${participant['state'][fieldMapping.duplicateType.toString()] ? `Passive recruit signed in as Active recruit` : ``}</td>`
                : ( participant['state'][fieldMapping.duplicateType.toString()] === fieldMapping.activeSignedAsPassive ) ?
                template += `<td>${participant['state'][fieldMapping.duplicateType.toString()] ? `Active recruit signed in as Passive recruit` : ``}</td>`
                :  template += `<td></td>`
            )
            : (x === fieldMapping.updateRecruitType.toString()) ? (
                ( participant['state'][fieldMapping.updateRecruitType.toString()] === fieldMapping.passiveToActive ) ?
                    template += `<td>${participant['state'][fieldMapping.updateRecruitType.toString()] ? `Passive To Active` : ``}</td>`
                : ( participant['state'][fieldMapping.updateRecruitType.toString()] === fieldMapping.activeToPassive ) ?
                template += `<td>${participant['state'][fieldMapping.updateRecruitType.toString()] ? `Active To Passive` : ``}</td>`
                :  template += `<td>${participant['state'][fieldMapping.updateRecruitType.toString()] ? `No Change Needed` : ``}</td>`
            )
            : (x === fieldMapping.firstNameMatch.toString()) ? (
                ( participant['state'][fieldMapping.firstNameMatch.toString()] === fieldMapping.matched ) ?
                    template += `<td>${participant['state'][fieldMapping.firstNameMatch.toString()] ? `Matched` : ``}</td>`
                : template += `<td>${participant['state'][fieldMapping.firstNameMatch.toString()] ? `Not Matched` : ``}</td>`
            )
            : (x === fieldMapping.lastNameMatch.toString()) ? (
                ( participant['state'][fieldMapping.lastNameMatch.toString()] === fieldMapping.matched ) ?
                    template += `<td>${participant['state'][fieldMapping.lastNameMatch.toString()] ? `Matched` : ``}</td>`
                : template += `<td>${participant['state'][fieldMapping.lastNameMatch.toString()] ? `Not Matched` : ``}</td>`
            )
            : (x === fieldMapping.dobMatch.toString()) ? (
                ( participant['state'][fieldMapping.dobMatch.toString()] === fieldMapping.matched ) ?
                    template += `<td>${participant['state'][fieldMapping.dobMatch.toString()] ? `Matched` : ``}</td>`
                : template += `<td>${participant['state'][fieldMapping.dobMatch.toString()] ? `Not Matched` : ``}</td>`
            )
            : (x === fieldMapping.pinMatch.toString()) ? (
                ( participant['state'][fieldMapping.pinMatch.toString()] === fieldMapping.matched ) ?
                    template += `<td>${participant['state'][fieldMapping.pinMatch.toString()] ? `Matched` : ``}</td>`
                : template += `<td>${participant['state'][fieldMapping.pinMatch.toString()] ? `Not Matched` : ``}</td>`
            )
            : (x === fieldMapping.tokenMatch.toString()) ? (
                ( participant['state'][fieldMapping.tokenMatch.toString()] === fieldMapping.matched ) ?
                    template += `<td>${participant['state'][fieldMapping.tokenMatch.toString()] ? `Matched` : ``}</td>`
                : template += `<td>${participant['state'][fieldMapping.tokenMatch.toString()] ? `Not Matched` : ``}</td>`
            )
            : (x === fieldMapping.zipCodeMatch.toString()) ? (
                ( participant['state'][fieldMapping.zipCodeMatch.toString()] === fieldMapping.matched ) ?
                    template += `<td>${participant['state'][fieldMapping.zipCodeMatch.toString()] ? `Matched` : ``}</td>`
                : template += `<td>${participant['state'][fieldMapping.zipCodeMatch.toString()] ? `Not Matched` : ``}</td>`
            )
            : (x === fieldMapping.siteMatch.toString()) ? (
                ( participant['state'][fieldMapping.siteMatch.toString()] === fieldMapping.criteriumMet ) ?
                    template += `<td>${participant['state'][fieldMapping.siteMatch.toString()] ? `CriteriumMet` : ``}</td>`
                : template += `<td>${participant['state'][fieldMapping.siteMatch.toString()] ? `Not Criterium Met` : ``}</td>`
            )
            : (x === fieldMapping.ageMatch.toString()) ? (
                ( participant['state'][fieldMapping.ageMatch.toString()] === fieldMapping.criteriumMet ) ?
                    template += `<td>${participant['state'][fieldMapping.ageMatch.toString()] ? `CriteriumMet` : ``}</td>`
                : template += `<td>${participant['state'][fieldMapping.ageMatch.toString()] ? `Not Criterium Met` : ``}</td>`
            )
            : (x === fieldMapping.cancerStatusMatch.toString()) ? (
                ( participant['state'][fieldMapping.cancerStatusMatch.toString()] === fieldMapping.criteriumMet ) ?
                    template += `<td>${participant['state'][fieldMapping.cancerStatusMatch.toString()] ? `CriteriumMet` : ``}</td>`
                : template += `<td>${participant['state'][fieldMapping.cancerStatusMatch.toString()] ? `Not Criterium Met` : ``}</td>`
            )
            : (template += `<td>${participant[x] ? participant[x] : ''}</td>`)
        })
        template += `</tr>`; 
    });
    template += '</tbody>';
    return template;
}

const addEventShowMoreInfo = data => {
    const elements = document.getElementsByClassName('showMoreInfo');
    Array.from(elements).forEach(element => {
        element.addEventListener('click', () => {
            const filteredData = data.filter(dt => dt.token === element.dataset.token);
            const header = document.getElementById('modalHeader');
            const body = document.getElementById('modalBody');
            const user = filteredData[0];
            header.innerHTML = `<h4>${user[fieldMapping.fName]} ${user[fieldMapping.lName]}</h4><button type="button" class="modal-close-btn" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>`
            let template = '<div>';
            for(let key in user){
                if(typeof user[key] === 'object') {
                    template += `<span><strong>${key}</strong></span> - <ul class="user-data-ul">`
                    for(let nestedKey in user[key]){
                        template += `<li><span><strong>${nestedKey}</strong></span> - <span>${user[key][nestedKey]}</span></li>`
                    }
                    template += `</ul>`
                }
                else {
                    template += `<span><strong>${key}</strong></span> - <span>${user[key]}</span></br>`
                }
            }
            body.innerHTML = template;
        })
    })

    const selectElements = document.getElementsByClassName('select-participant');
    Array.from(selectElements).forEach(element => {
        element.addEventListener('click', async () => {
            const filteredData = data.filter(dt => dt.token === element.dataset.token);
            let adminSubjectAudit = [];
            let changedOption = {};
            const loadDetailsPage = '#participantDetails'
            location.replace(window.location.origin + window.location.pathname + loadDetailsPage); // updates url to participantDetails upon screen update
            const siteKey = await getAccessToken();
            renderParticipantDetails(filteredData[0], adminSubjectAudit, changedOption, siteKey);
        });
    });

}
export const addEventFilterData = (data, showButtons) => {
    const btn = document.getElementById('filterData');
    if(!btn) return;
    btn.addEventListener('keyup', async () => {
        const value = document.getElementById('filterData').value.trim();
        if(value.length < 3) {
            renderData(data, showButtons);
            return;
        };
        renderData(searchBy(data, value), showButtons);
    });
}
export const filterdata = (data) => {
    return data.filter(participant => participant['699625233'] !== undefined);
}

export const filterBySiteKey = (data, sitePref) => {
    let filteredData = [];
    data.filter(participant => 
        {
            if (participant['827220437'] === sitePref) {
                filteredData.push(participant);
            }
        })
    return filteredData;
}

export const activeColumns = (data, showButtons) => {
    const btns = document.getElementsByName('column-filter');
    Array.from(btns).forEach(btn => {
        const value = btn.dataset.column;
        if(importantColumns.indexOf(value) !== -1) {
            btn.classList.add('filter-active');
        }
        btn.addEventListener('click', async () => {
            if(!btn.classList.contains('filter-active')){
                btn.classList.add('filter-active');
                importantColumns.push(value);
                if(document.getElementById('filterData').value.trim().length >= 3) {
                    renderData(searchBy(data, document.getElementById('filterData').value.trim()), showButtons);
                }
                else {
                    renderData(data, showButtons);
                }
            }
            else{
                btn.classList.remove('filter-active');
                importantColumns.splice(importantColumns.indexOf(value), 1);
                if(document.getElementById('filterData').value.trim().length >= 3) {
                    renderData(searchBy(data, document.getElementById('filterData').value.trim()), showButtons);
                }
                else {
                    renderData(data, showButtons);
                }
            }
        })
    });
}

export const searchBy = (data, value) => {
    return data.filter(dt => {
        const fn = dt[conceptIdMapping.fName];
        const ln = dt['996038075'];
        
        if((new RegExp(value, 'i')).test(fn)) {
            // dt.RcrtUP_Fname_v1r0 = fn.replace((new RegExp(value, 'ig')), "<b>$&</b>");
            return dt
        }
        if((new RegExp(value, 'i')).test(ln)) {
            // dt.RcrtUP_Lname_v1r0 = ln.replace((new RegExp(value, 'ig')), "<b>$&</b>");
            return dt
        }
        if((new RegExp(value, 'i')).test(dt.Connect_ID)) {
            // const ID = dt.Connect_ID.toString();
            // dt.Connect_ID = ID.replace((new RegExp(value, 'ig')), "<b>$&</b>");
            return dt
        }
    });
}

const alertTrigger = () => {
    let alertList = document.getElementById('alert_placeholder');
    let template = ``;
    template += `
        <div class="alert alert-danger alert-dismissible fade show" role="alert">
            No results found!
        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
            <span aria-hidden="true">&times;</span>
        </button>
    </div>`
    alertList.innerHTML = template;
    return template;
}

export const dropdownTriggerAllParticipants = (sitekeyName) => {
    let a = document.getElementById('dropdownSites');
    if (a) {
        let dropdownMenuButton = document.getElementById('dropdownMenuButtonSites');
        let tempSiteName = a.innerHTML = sitekeyName;
        if (dropdownMenuButton) {
            dropdownMenuButton.addEventListener('click', (e) => {
                if (sitekeyName === 'Filter by Site' || sitekeyName === tempSiteName) {
                    a.innerHTML = e.target.textContent;
                    const t = getDataAttributes(e.target);
                    const query = `sitePref=${t.sitekey}`;
                    reRenderTableParticipantsAllTable(query, t.sitekey, e.target.textContent);
                }
            })
    }}
}

const reRenderTableParticipantsAllTable = async (query, sitePref, currentSiteSelection) => {
    showAnimation();
    const sitePrefId = nameToKeyObj[sitePref];
    const response = await getParticipantFromSites(sitePrefId);
    hideAnimation();
    if(response.code === 200 && response.data.length > 0) {
        const mainContent = document.getElementById('mainContent')
        let filterRawData = filterdata(response.data);
        if (filterRawData.length === 0)  return alertTrigger();
        localStorage.setItem('filterRawData', JSON.stringify(filterRawData))
        mainContent.innerHTML = renderTable(filterRawData, 'participantAll');
        addEventFilterData(filterRawData);
        renderData(filterRawData);
        activeColumns(filterRawData);
        renderLookupSiteDropdown();
        dropdownTriggerAllParticipants(currentSiteSelection);
    }
    else if(response.code === 200 && response.data.length === 0) {
        return alertTrigger();
    }
    else if(response.code != 200 && response.data.length === 0) {
        clearLocalStorage();
    }
}

export const renderLookupSiteDropdown = () => {
    let dropDownstatusFlag = localStorage.getItem('dropDownstatusFlag');
    if (dropDownstatusFlag === 'true') {
        document.getElementById("siteDropdownLookup").hidden = false }
}

const getCustomVariableNames = (x) => {
    if (x === fieldMapping.refusedSpecimenSurevys)
        return 'Refused baseline specimen surveys'
    else if (x === fieldMapping.dateHipaaRevokeRequested)
        return 'Date revoked HIPAA'
    else {}

}

const getParticipantFromSites = async (query) => {
    const siteKey = await getAccessToken();
    let template = ``;
    (query === nameToKeyObj.allResults) ? template += `/dashboard?api=getParticipants&type=all` : template += `/dashboard?api=getParticipants&type=all&siteCode=${query}`
    const response = await fetch(`${baseAPI}${template}`, {
        method: "GET",
        headers: {
            Authorization:"Bearer "+siteKey
        }
    });
    return await response.json();
}