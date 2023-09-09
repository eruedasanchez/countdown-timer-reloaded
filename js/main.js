const targetDate = '2023-09-11T20:05:00';

const getTimeSegmentElements = segmentElement => {
    const segmentDisplay = segmentElement.querySelector('.segment-display');
    const segmentDisplayTop = segmentDisplay.querySelector('.segment-display__top');
    const segmentDisplayBottom = segmentDisplay.querySelector('.segment-display__bottom');
    const segmentOverlay = segmentDisplay.querySelector('.segment-overlay');
    const segmentOverlayTop = segmentOverlay.querySelector('.segment-overlay__top');
    const segmentOverlayBottom = segmentOverlay.querySelector('.segment-overlay__bottom');

    return {segmentDisplayTop, segmentDisplayBottom, segmentOverlay, segmentOverlayTop, segmentOverlayBottom};
}

const updateSegmentValues = (displayElement, overlayElement, value) => {
    displayElement.textContent = value;
    overlayElement.textContent = value;
}

const updateTimeSegment = (segmentElement, timeValue) => {
    const segmentElements = getTimeSegmentElements(segmentElement);

    if(parseInt(segmentElements.segmentDisplayTop.textContent, 10) === timeValue) return;

    segmentElements.segmentOverlay.classList.add('flip');

    updateSegmentValues(segmentElements.segmentDisplayTop, segmentElements.segmentOverlayBottom, timeValue);

    const finishAnimation = () => {
        segmentElements.segmentOverlay.classList.remove('flip');
        updateSegmentValues(segmentElements.segmentDisplayBottom, segmentElements.segmentOverlayTop, timeValue);

        this.removeEventListener('animationend', finishAnimation);
    }

    segmentElements.segmentOverlay.addEventListener('animationend', finishAnimation);
}

const updateTimeSection = (sectionId, timeValue) => {
    const firstNumber = Math.floor(timeValue / 10);
    const secondNumber = timeValue % 10;

    const sectionElement = document.getElementById(sectionId);
    const timeSegments = sectionElement.querySelectorAll('.time-segment');

    updateTimeSegment(timeSegments[0], firstNumber);
    updateTimeSegment(timeSegments[1], secondNumber);
}

const getTimeRemaining = targetDateTime => {
    const nowTime = Date.now();
    
    let secondsRemaining = Math.floor((targetDateTime - nowTime) / 1000);

    const complete = nowTime >= targetDateTime;

    if(complete) return {complete, days: 0, seconds: 0, minutes: 0, hours: 0};

    const SECONDS_PER_DAY = 86400;
    const SECONDS_PER_HOUR = 3600;
    const SECONDS_PER_MINUT = 60;
    
    const days  = Math.floor(secondsRemaining / SECONDS_PER_DAY);
    secondsRemaining = secondsRemaining % SECONDS_PER_DAY; 
    const hours  = Math.floor(secondsRemaining / SECONDS_PER_HOUR);
    secondsRemaining = secondsRemaining % SECONDS_PER_HOUR;
    const minutes = Math.floor(secondsRemaining / SECONDS_PER_MINUT);
    secondsRemaining = secondsRemaining % SECONDS_PER_MINUT;
    const seconds = secondsRemaining;

    return {complete, days, seconds, minutes, hours};
}

const updateAllSegments = () => {
    const targetTimeStamp = new Date(targetDate).getTime(); // getTime() obtiene la cantidad de milisegundos desde el 1-1-1970 hasta la fecha pasada en targetDate
    
    const timeRemainingBits = getTimeRemaining(targetTimeStamp);
    
    updateTimeSection('days', timeRemainingBits.days);
    updateTimeSection('seconds', timeRemainingBits.seconds);
    updateTimeSection('minutes', timeRemainingBits.minutes);
    updateTimeSection('hours', timeRemainingBits.hours);

    return timeRemainingBits.complete;
}

const countdownTimer = setInterval(() => {
    const isComplete = updateAllSegments();

    if(isComplete) clearInterval(countdownTimer);
}, 1000);







