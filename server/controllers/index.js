
const models = require('../models');

const Dog = models.Dog.DogModel;


const defaultData = {
  name: 'unknown',
  breed: 'unknown',
  age: 0,
};

let lastAdded = new Dog(defaultData);

const hostIndex = (req, res) => {
  res.render('index', {
    currentName: lastAdded.name,
    title: 'Home',
    pageName: 'Home Page',
  });
};

const readAllDogs = (req, res, callback) => {
  Dog.find(callback);
};

const readDog = (req, res) => {
  const name1 = req.query.name;

  const callback = (err, doc) => {
    if (err) {
      return res.json({ err });
    }

    return res.json(doc);
  };

  Dog.findByName(name1, callback);
};

const hostPage1 = (req, res) => {
  const callback = (err, docs) => {
    if (err) {
      return res.json({ err }); // if error, return it
    }

    // return success
    return res.render('page1', { dogs: docs });
  };

  readAllDogs(req, res, callback);
};

const hostPage2 = (req, res) => {
  res.render('page2');
};

const hostPage3 = (req, res) => {
  res.render('page3');
};
const hostPage4 = (req, res) => {
   const callback = (err, docs) => {
    if (err) {
      return res.json({ err }); // if error, return it
    }

    // return success
    return res.render('page1', { dogs: docs });
  };

  readAllDogs(req, res, callback);
};

const getName = (req, res) => {
  res.json({ name: lastAdded.name });
};

const setName = (req, res) => {
  if (!req.body.name || !req.body.breed || !req.body.age) {
    return res.status(400).json({ error: 'name, breed, and age are all required' });
  }
  const name = `${req.body.name}`;
  const dogData = {
    name,
    breed: req.body.breed,
    age: req.body.age,
  };

  const newDog = new Dog(dogData);

  const savePromise = newDog.save();

  savePromise.then(() => {
    lastAdded = newDog;
    res.json({ name: lastAdded.name, breed: lastAdded.breed, age: lastAdded.age });
  });

  savePromise.catch(err => res.json({ err }));

  return res;
};

const searchName = (req, res) => {
  if (!req.query.name) {
    return res.json({ error: 'Name is required to perform a search' });
  }
  return Dog.findByName(req.query.name, (err, doc) => {
    if (err) {
      return res.json({ err });
    }

    if (!doc) {
      return res.json({ error: 'No dogs found' });
    }
    if (doc.age !== '') {
      doc.age = req.query.age;
    }

    return res.json({ name: doc.dog, breed: doc.breed, age: doc.age });
  });
};

const updateLast = (req, res) => {
  lastAdded.age++;

  const savePromise = lastAdded.save();
  savePromise.then(() => res.json({ name: lastAdded.name, breed: lastAdded.breed, age: lastAdded.age }));

  savePromise.catch(err => res.json({ err }));
};

const notFound = (req, res) => {
  res.status(404).render('notFound', {
    page: req.url,
  });
};

module.exports = {
  index: hostIndex,
  page1: hostPage1,
  page2: hostPage2,
  page3: hostPage3,
  page4: hostPage4,
  readDog,
  getName,
  setName,
  updateLast,
  searchName,
  notFound,
};
