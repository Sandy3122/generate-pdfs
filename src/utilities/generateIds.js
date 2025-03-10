module.exports = {
    generateNumericId: function () {
      let numericId = '';
      for (let i = 0; i < 7; i++) {
        numericId += Math.floor(Math.random() * 10);
      }
      return numericId;
    }
  };
  