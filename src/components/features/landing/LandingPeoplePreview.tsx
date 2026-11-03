import { useTranslation } from 'react-i18next';

export function LandingPeoplePreview() {
  const { t } = useTranslation();
  return (
    <div className="landing-feature-art landing-people-art">
      <svg viewBox="0 0 500 400" aria-hidden className="landing-people-drawing">
        <g className="landing-people-back">
          <path d="M60 330V295C60 245 94 220 143 220S225 245 225 295V330M280 300V265C280 215 314 190 363 190S445 215 445 265V300" />
          <ellipse cx="143" cy="156" rx="43" ry="52" />
          <ellipse cx="363" cy="126" rx="43" ry="52" />
          <path d="M124 150h2m31 0h2m-27 22q12 10 24 0M344 120h2m31 0h2m-27 22q12 10 24 0" />
          <path d="M100 144q15-62 75-23M322 113q30-60 80-8" />
        </g>
        <g className="landing-people-front">
          <path d="M150 380V338C150 278 190 251 250 251S350 278 350 338V380" />
          <ellipse cx="250" cy="184" rx="48" ry="57" />
          <path d="M202 174q18-67 94-17M228 180h2m39 0h2m-34 24q13 13 27 0M195 380v-52m110 52v-52" />
        </g>
      </svg>
      <p className="landing-people-hello">{t('landing.preview.greeting')}</p>
    </div>
  );
}
