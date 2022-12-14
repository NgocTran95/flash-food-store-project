import classNames from 'classnames/bind';
import { NavLink, Link } from 'react-router-dom';
import Slider from 'react-slick';

import styles from './Navigation.module.scss';
import { MENU_LIST } from '../../HomePage/OfferMenu/OfferMenu';
import OfferMenuSliderArrow from '../../HomePage/OfferMenu/OfferMenuSliderArrow';
import { formatFoodName } from '../../../utils';

const cx = classNames.bind(styles);

export const settings = {
  infinite: true,
  speed: 800,
  slidesToShow: 4,
  slidesToScroll: 4,
  prevArrow: <OfferMenuSliderArrow to="prev" />,
  nextArrow: <OfferMenuSliderArrow to="next" />,
  responsive: [
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 3,
        slidesToScroll: 3,
        infinite: true,
      },
    },
    {
      breakpoint: 900,
      settings: {
        slidesToShow: 3,
        slidesToScroll: 3,
        initialSlide: 3,
      },
    },
    {
      breakpoint: 600,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
      },
    },
  ],
};


interface Props {
  currentFoodType: string,
}

function Navigation({currentFoodType}: Props) {
  return (
    <section className={cx('container')}>
      <div className={cx('inner')}>
        <h1 className={cx('heading')}>
          {currentFoodType === 'best-foods'
            ? 'Shop'
            : formatFoodName(currentFoodType).toUpperCase()}
        </h1>
        <div className={cx('breadscrum')}>
          <Link to="/" className={cx('link')}>
            Home
          </Link>{' '}
          /{' '}
          {currentFoodType === 'best-foods' ? (
            'Shop'
          ) : (
            <Link to="/products" className={cx('link')}>
              Shop
            </Link>
          )}
          {currentFoodType !== 'best-foods' &&
            ` / ${formatFoodName(currentFoodType)}`}
        </div>
        <Slider {...settings} className={cx('slider')}>
          {MENU_LIST.map((item, id) => (
            <div key={id}>
              <div className={cx('slide-inner')}>
                <NavLink
                  to={item.to}
                  className={({ isActive }) =>
                    isActive
                      ? cx('slide-thumbnail', 'active')
                      : cx('slide-thumbnail')
                  }
                >
                  <div className={cx('slide-image')}>
                    <img src={item.image} alt={item.name} />
                  </div>
                </NavLink>
                <p className={cx('slide-name')}>{item.name}</p>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </section>
  );
}

export default Navigation;
