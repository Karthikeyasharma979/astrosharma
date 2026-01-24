import React from 'react';

// Import images from assets
import ariesImg from '../../assets/aries.png';
import taurusImg from '../../assets/taurus.png';
import geminiImg from '../../assets/gemini.png';
import cancerImg from '../../assets/cancer.png';
import leoImg from '../../assets/leo.png';
import virgoImg from '../../assets/virgo.png';
import libraImg from '../../assets/libra.png';
import scorpioImg from '../../assets/scorpio.png';
import sagittariusImg from '../../assets/sagittarius.png';
import capricornImg from '../../assets/capricorn.png';
import aquariusImg from '../../assets/aquarius.png';
import piscesImg from '../../assets/pisces.png';

// Export components that render the images
// We pass className to control size, but ignore text-color classes since these are PNGs
export const Aries = ({ className }) => (
    <img src={ariesImg} alt="Aries" className={className} />
);

export const Taurus = ({ className }) => (
    <img src={taurusImg} alt="Taurus" className={className} />
);

export const Gemini = ({ className }) => (
    <img src={geminiImg} alt="Gemini" className={className} />
);

export const Cancer = ({ className }) => (
    <img src={cancerImg} alt="Cancer" className={className} />
);

export const Leo = ({ className }) => (
    <img src={leoImg} alt="Leo" className={className} />
);

export const VirgoReal = ({ className }) => (
    <img src={virgoImg} alt="Virgo" className={className} />
);

export const Libra = ({ className }) => (
    <img src={libraImg} alt="Libra" className={className} />
);

export const Scorpio = ({ className }) => (
    <img src={scorpioImg} alt="Scorpio" className={className} />
);

export const Sagittarius = ({ className }) => (
    <img src={sagittariusImg} alt="Sagittarius" className={className} />
);

export const Capricorn = ({ className }) => (
    <img src={capricornImg} alt="Capricorn" className={className} />
);

export const Aquarius = ({ className }) => (
    <img src={aquariusImg} alt="Aquarius" className={className} />
);

export const Pisces = ({ className }) => (
    <img src={piscesImg} alt="Pisces" className={className} />
);
