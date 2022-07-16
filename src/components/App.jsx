import Notiflix from 'notiflix';
import { SearchBar } from './Searchbar/Searchbar';
import { ImageGallery } from './ImageGallery/ImageGallery';
import { Loader } from './Loader/Loader';
import { Button } from './Button/Button';
import { AppBox } from './App.styled';
import { Modal } from './Modal/Modal';
import { useState } from 'react';
import { useEffect } from 'react';
import fetchImages from './services/API-Pixabay';

const CARD_HEIGHT = 260;

const notiflixOptions = Notiflix.Notify.init({
  width: '400px',
  position: 'top-right',
  distance: '50px',
  borderRadius: '10px',
  clickToClose: true,
  useIcon: false,
  fontSize: '23px',
});

export const App = () => {
  const [page, setPage] = useState(1);
  const [queue, setQueue] = useState('');
  const [hits, setHits] = useState([]);
  const [loaderHidden, setLoaderHidden] = useState(true);
  const [totalHits, setTotalHits] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [modalHidden, setModalHidden] = useState(true);
  const [modalImg, setModalImg] = useState('');

  const getRequest = data => {
    setQueue(prevState => {
      if (
        prevState.toLowerCase().trim() === data.toLowerCase().trim() &&
        data.toLowerCase().trim() !== ''
      ) {
        return Notiflix.Notify.info(
          `You are already looking for ${data}. Change you request.`,
          notiflixOptions
        );
      } else if (data.toLowerCase() === '') {
        setQueue('');
        return Notiflix.Notify.info(`Enter some request.`, notiflixOptions);
      } else {
        setPage(1);
        setQueue(data);
        setHits([]);
        setTotalHits(0);
      }
    });
  };

  // const timeout = () =>
  //   setTimeout(() => {
  //     window.scrollBy({
  //       top: CARD_HEIGHT * 2,
  //       behavior: 'smooth',
  //     });
  //   }, 400);

  const toggleModal = largeImg => {
    if (modalImg === '') {
      setModalHidden(false);
      return setModalImg(largeImg);
    }
    setModalHidden(true);
    return setModalImg('');
  };

  const loadMore = () => {
    setIsLoading(true);
    setPage(prevState => prevState + 1);
  };
  useEffect(() => {
    if (queue === '') {
      return;
    }

    async function fetchImagesData() {
      try {
        setLoaderHidden(false);
        const imagesData = await fetchImages(queue, page);
        if (imagesData.totalHits === 0) {
          return Notiflix.Notify.failure(
            `Have no images on your request ${queue}`,
            notiflixOptions
          );
        }
        const images = imagesData.hits.map(item => {
          let data = {
            id: item.id,
            webformatURL: item.webformatURL,
            largeImageURL: item.largeImageURL,
          };
          return data;
        });
        if (imagesData.totalHits !== 0 && totalHits === 0) {
          setTotalHits(imagesData.totalHits);
          Notiflix.Notify.success(
            `Hooray! We found ${imagesData.totalHits} images.`,
            notiflixOptions
          );
          return setHits(images);
        } else {
          return setHits(prevState => [...prevState, ...images]);
        }
      } catch {
        return Notiflix.Notify.failure(
          'Oops something goes wrong, change your request or refresh page',
          notiflixOptions
        );
      } finally {
        setIsLoading(false);
        setLoaderHidden(true);
      }
    }

    fetchImagesData();

    return;
    // axios
    //   .get(URI, {
    //     params: {
    //       q: queue,
    //       page: page,
    //       key: API_KEY,
    //       image_type: 'photo',
    //       orientation: 'horizontal',
    //       per_page: 12,
    //     },
    //   })
    // .then(response => {
    //   if (response.data.totalHits !== 0 && totalHits === 0) {
    //     Notiflix.Notify.success(
    //       `Hooray! We found ${response.data.totalHits} images.`,
    //       notiflixOptions
    //     );
    //   }

    //   if (hits.length < response.data.totalHits) {
    //     let data = response.data.hits.map(item => {
    //       let data = {
    //         id: item.id,
    //         webformatURL: item.webformatURL,
    //         largeImageURL: item.largeImageURL,
    //       };
    //       return data;
    //     });

    //     return setHits(
    //       prevState => [...prevState, ...data],
    //     );
    //   } else {
    //     throw new Error('Oops');
    //   }
    // })
    // .then(async () => {
    //   if (hits.length > 0) {
    //     timeout();
    //   }
    //   await clearTimeout(timeout);
    // })
    // .catch(error => {
    //   console.log(error);
    //   return Notiflix.Notify.failure(
    //     'Oops something goes wrong, change your request or refresh page',
    //     notiflixOptions
    //   );
    // })
    // .then(() => {
    //   setIsLoading(false);
    //   setLoaderHidden(true);
    // });
  }, [page, queue, totalHits]);
  useEffect(() => {
    if (page > 1) {
      window.scrollBy({
        top: CARD_HEIGHT * 2,
        behavior: 'smooth',
      });
    }
  });

  // componentDidUpdate(prevProps, prevState) {
  //   if (
  //     prevState.page !== this.state.page ||
  //     prevState.queue !== this.state.queue
  //   ) {
  //     this.setState({ loaderHidden: false });
  //     axios
  //       .get(URI, {
  //         params: {
  //           q: this.state.queue,
  //           page: this.state.page,
  //           key: API_KEY,
  //           image_type: 'photo',
  //           orientation: 'horizontal',
  //           per_page: 12,
  //         },
  //       })
  //       .then(response => {
  //         if (response.data.totalHits !== 0 && this.state.totalHits === 0) {
  //           Notiflix.Notify.success(
  //             `Hooray! We found ${response.data.totalHits} images.`,
  //             notiflixOptions
  //           );
  //         }

  //         if (this.state.hits.length < response.data.totalHits) {
  //           let data = response.data.hits.map(item => {
  //             let data = {
  //               id: item.id,
  //               webformatURL: item.webformatURL,
  //               largeImageURL: item.largeImageURL,
  //             };
  //             return data;
  //           });
  //           this.setState(prevState => ({
  //             totalHits: response.data.totalHits,
  //             hits: [...prevState.hits, ...data],
  //           }));
  //         } else {
  //           throw new Error('Oops');
  //         }
  //       })
  //       .then(async () => {
  //         if (this.state.hits.length > 0) {
  //           this.timeout();
  //         }
  //         await clearTimeout(this.timeout);
  //       })
  //       .catch(error => {
  //         console.log(error);
  //         return Notiflix.Notify.failure(
  //           'Oops something goes wrong, change your request or refresh page',
  //           notiflixOptions
  //         );
  //       })
  //       .then(() => {
  //         this.setState({ loaderHidden: true, isLoading: false });
  //       });
  //   }
  //   // return;
  // }

  return (
    <AppBox>
      <SearchBar onSubmit={getRequest} />
      {hits.length !== 0 && (
        <ImageGallery
          data={hits}
          toggleModal={toggleModal}
          isModalOpen={modalHidden}
        />
      )}
      {!loaderHidden && <Loader />}
      {hits.length < totalHits && (
        <Button onClick={loadMore} loading={isLoading} />
      )}
      {!modalHidden && (
        <Modal onClose={toggleModal}>
          <img src={modalImg} alt="" />
        </Modal>
      )}
    </AppBox>
  );
};

// export class App extends Component {
//   state = {
//     page: 1,
//     queue: '',
//     hits: [],
//     loaderHidden: true,
//     totalHits: 0,
//     isLoading: false,
//     modalHidden: true,
//     modalImg: '',
//   };

//   getRequest = data => {
//     console.log(data);
//     this.setState(prevState => {
//       if (
//         prevState.queue.toLowerCase().trim() ===
//           data.queue.toLowerCase().trim() &&
//         data.queue.toLowerCase().trim() !== ''
//       ) {
//         return Notiflix.Notify.info(
//           `You are already looking for ${this.state.queue}. Change you request.`,
//           notiflixOptions
//         );
//       } else if (data.queue.toLowerCase() === '') {
//         return Notiflix.Notify.info(`Enter some request.`, notiflixOptions);
//       } else {
//         return {
//           page: 1,
//           queue: data.queue,
//           hits: [],
//           totalHits: 0,
//         };
//       }
//     });
//   };

//   timeout = () =>
//     setTimeout(() => {
//       window.scrollBy({
//         top: 1000,
//         behavior: 'smooth',
//       });
//     }, 400);

//   loadMore = () => {
//     // this.timeout();
//     this.setState(prevState => ({ page: prevState.page + 1, isLoading: true }));
//   };
//   toggleModal = largeImg => {
//     if (this.state.modalImg === '') {
//       return this.setState({ modalHidden: false, modalImg: largeImg });
//     }
//     return this.setState({ modalHidden: true, modalImg: '' });
//   };

//   componentDidUpdate(prevProps, prevState) {
//     if (
//       prevState.page !== this.state.page ||
//       prevState.queue !== this.state.queue
//     ) {
//       this.setState({ loaderHidden: false });
//       axios
//         .get(URI, {
//           params: {
//             q: this.state.queue,
//             page: this.state.page,
//             key: API_KEY,
//             image_type: 'photo',
//             orientation: 'horizontal',
//             per_page: 12,
//           },
//         })
//         .then(response => {
//           if (response.data.totalHits !== 0 && this.state.totalHits === 0) {
//             Notiflix.Notify.success(
//               `Hooray! We found ${response.data.totalHits} images.`,
//               notiflixOptions
//             );
//           }

//           if (this.state.hits.length < response.data.totalHits) {
//             let data = response.data.hits.map(item => {
//               let data = {
//                 id: item.id,
//                 webformatURL: item.webformatURL,
//                 largeImageURL: item.largeImageURL,
//               };
//               return data;
//             });
//             this.setState(prevState => ({
//               totalHits: response.data.totalHits,
//               hits: [...prevState.hits, ...data],
//             }));
//           } else {
//             throw new Error('Oops');
//           }
//         })
//         .then(async () => {
//           if (this.state.hits.length > 0) {
//             this.timeout();
//           }
//           await clearTimeout(this.timeout);
//         })
//         .catch(error => {
//           console.log(error);
//           return Notiflix.Notify.failure(
//             'Oops something goes wrong, change your request or refresh page',
//             notiflixOptions
//           );
//         })
//         .then(() => {
//           this.setState({ loaderHidden: true, isLoading: false });
//         });
//     }
//     return;
//   }

//   render() {
//     return (
//       <AppBox>
//         <SearchBar onSubmit={this.getRequest} />
//         {this.state.hits.length !== 0 && (
//           <ImageGallery
//             data={this.state.hits}
//             toggleModal={this.toggleModal}
//             isModalOpen={this.state.modalHidden}
//           />
//         )}
//         {!this.state.loaderHidden && <Loader />}
//         {this.state.hits.length < this.state.totalHits && (
//           <Button onClick={this.loadMore} loading={this.state.isLoading} />
//         )}
//         {!this.state.modalHidden && (
//           <Modal onClose={this.toggleModal}>
//             <img src={this.state.modalImg} alt="" />
//           </Modal>
//         )}
//       </AppBox>
//     );
//   }
// }
