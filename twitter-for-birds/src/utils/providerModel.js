/* eslint-disable */
export default class Provider {
  constructor(provider) {
    if (provider) {
      Object.assign(this, provider);
      this.acceptsNewPatients = this['availability.accepting_new_patients'] === true;
      this.hasOnlineScheduling = this['availability.native_scheduling'] === true;
    }
  }

  get fullAddress() {
    if (this.office?.state) {
      const address = [];
      address.push(this.office.address1);
      this.office.address2 && address.push(this.office.address2);
      address.push(
        this.office.city,
        this.office.state[0],
        this.office.zipcode,
      );
      return address.join(', ');
    }

    return '';
  }

  get office() {
    if (this.officeAddress) {
      const searchParams = new URLSearchParams(window.location.search);
      return this.officeAddress.find((office) => office.id === searchParams.get('location')) || this.officeAddress[0];
    }

    return null;
  }

  get hideRequestAppointment() {
    return this?.hideRequestAppt ?? false;
  }

  get address1() {
    return this.office?.address1;
  }

  get address2() {
    return this.office?.address2;
  }

  get isFhmg() {
    return this.office?.athenaProviderId != null;
  }

  get nonAthenaAndOutOfState() {
    if (this.office?.state) {
      return !this.office?.athenaProviderId && this.office?.state[0] !== 'FL';
    }

    return false;
  }

  get nonAthenaOrNoOnlineScheduling() {
    return !this.office?.athenaProviderId || !this.hasOnlineScheduling;
  }

  get hasAverageRating() {
    return this.averageRating !== 0;
  }

  get videoLink() {
    return this.videos && this.videos[0].split(/(youtube:\/\/v\/)/);
  }

  get initials() {
    if (this.firstName && this.lastName) {
      return `${this.firstName[0]}${this.lastName[0]}`.toUpperCase();
    }

    return '';
  }

  get sslImageUrl() {
    return this.photoURL ? this.photoURL.replace(/^http:\/\//, 'https://') : null;
  }

  get locations() {
    if (!this.officeAddress) { return []; }
    return this.officeAddress
      .sort((a, b) => (a.distance - b.distance))
      .map((office) => {
        const officeCity = office.city ? `${office.city} Office` : '';
        office.milesAway = `${office.distance?.toFixed(1) || 0} miles away`;
        office.description = `${officeCity} - ${office.milesAway}`;
        return office;
      });
  }
}
