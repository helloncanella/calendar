var ClassInformation = {
  duration:{
    value: 2,
    error: 1,
    total: function() {
      return this.value + this.error;
    }
  }
};
