import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGrip, faListUl } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState } from 'react';
import {
  faChevronLeft,
  faChevronRight,
} from '@fortawesome/free-solid-svg-icons';

import styles from './ProductList.module.scss';
import CustomSelect from '../../../components/CustomSelect';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import {
  getPagination,
  getProducts,
} from '../../../features/products/services';
import GridProductView from './GridProductView';
import ListProductView from './ListProductView';

const SORT_OPTIONS = [
  { name: 'Default Sorting', value: 'default' },
  { name: 'Sort by average rating', value: 'rating' },
  { name: 'Sort by price: High to Low', value: 'price-des' },
  { name: 'Sort by price: Low to High', value: 'price-inc' },
  { name: 'Sort by from A to Z', value: 'alphabet' },
  { name: 'Sort by from Z to A', value: 'alphabet-reverse' },
];
const cx = classNames.bind(styles);

interface Props {
  currentFoodType: string;
}

function ProductList({ currentFoodType }: Props) {
  const dispatch = useAppDispatch();
  const { pagination } = useAppSelector(
    (state) => state.products,
  );
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [page, setPage] = useState<number>(1)

  const PRODUCTS_PER_PAGE = 12;
  const productTotal = pagination[currentFoodType];
  const pageTotal = Math.ceil(productTotal / PRODUCTS_PER_PAGE);
  const firstProductPosition = (page - 1) * PRODUCTS_PER_PAGE + 1;
  const lastProductPosition =
    page * PRODUCTS_PER_PAGE > productTotal
      ? productTotal
      : page * PRODUCTS_PER_PAGE;
  
  // Reset page when switch to other food
  useEffect(() => {
    setPage(1)
  }, [currentFoodType])

  useEffect(() => {
    dispatch(
      getProducts({
        route: currentFoodType,
        page: page,
        limit: PRODUCTS_PER_PAGE,
      }),
    );
  }, [dispatch, currentFoodType, page]);
  
  useEffect(() => {
    dispatch(getPagination());
    localStorage.setItem('pagination', JSON.stringify(pagination));
    // eslint-disable-next-line
  }, [dispatch]);

  const scrollToView = () => {
    document.body.scrollTop = 500; // For Safari
    document.documentElement.scrollTop = 500; // For Chrome, Firefox, IE and Opera
  };

  const handleSwitchPage = (page: number) => {
    scrollToView();
    setPage(page);
  };

  const handlePrevNextPage = (action: 'prev' | 'next') => {
    if (action === 'prev') {
      if (page === 1) return;
      setPage(page - 1);
      scrollToView();
    } else {
      if (page === pageTotal) return;
      setPage(page + 1);
      scrollToView();
    }
  };

  return (
    <section className={cx('container')}>
      <div className={cx('topbar')}>
        <p className={cx('count-item')}>
          Showing {firstProductPosition}-{lastProductPosition} of {productTotal}{' '}
          item(s)
        </p>
        <div className={cx('tools-bar')}>
          <div className={cx('display')}>
            <button
              className={cx('display-btn', view === 'grid' && 'active')}
              onClick={() => setView('grid')}
            >
              <FontAwesomeIcon icon={faGrip} />
            </button>
            <button
              className={cx('display-btn', view === 'list' && 'active')}
              onClick={() => setView('list')}
            >
              <FontAwesomeIcon icon={faListUl} />
            </button>
          </div>
          <CustomSelect optionArray={SORT_OPTIONS} />
        </div>
      </div>
      {view === 'grid' ? <GridProductView /> : <ListProductView />}
      <div className={cx('pagination')}>
        <button
          className={cx('pagination-btn', page === 1 && 'hide')}
          onClick={() => handlePrevNextPage('prev')}
        >
          <FontAwesomeIcon icon={faChevronLeft} />
        </button>
        {Array.from(Array(pageTotal).keys()).map((item) => (
          <button
            key={item}
            className={cx('pagination-btn', page === item + 1 && 'active')}
            onClick={() => handleSwitchPage(item + 1)}
          >
            {item + 1}
          </button>
        ))}
        <button
          className={cx('pagination-btn', page === pageTotal && 'hide')}
          onClick={() => handlePrevNextPage('next')}
        >
          <FontAwesomeIcon icon={faChevronRight} />
        </button>
      </div>
    </section>
  );
}

export default ProductList;
