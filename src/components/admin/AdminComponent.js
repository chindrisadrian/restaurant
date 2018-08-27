import React from 'react';
import BookingItem from './BookingItem';

class AdminComponent extends React.Component {
    /* State will contain objects that are retreived from MYSQL. convertedBookings
    is the same data, but converted to Date-format. */
    state = {
      allBookings: null,
      convertedBookings: [],
      editing: false,
      bookingToEdit: {},
      updatedBooking: {}
    }

    /* Before the component is mounted fetchBookings is called and the result is
    stored in this.state.allBookings. */
    componentWillMount = () => {
      this.fetchBookings()
        .then((bookings) => {
          this.setState({ allBookings: bookings }, () => {
            this.convertBookingstoDates();
            console.log(this.state.allBookings);
          });
        })
    }

    fetchBookings = () => {
      return fetch("http://localhost:8888/fetch_bookings_and_customers.php")
        .then((response) => response.json())
    }

    /* Converts this.state.allBookings from MySQL date-format to something that
    JavaScript can understand through new Date. */
    convertBookingstoDates = (props) => {
      if (this.state.allBookings) {
        let allConvertedBookings = [];
        this.state.allBookings.map((booking) => {
          allConvertedBookings.push(new Date(booking.date));
        });
        this.setState({ convertedBookings: allConvertedBookings }, () => console.log(this.state.convertedBookings));
      }
    }

    deleteBooking = (e) => {
      const itemToDelete = {
        itemToDelete: e.target.id
      };

      //Delete booking from DB
      this.props.sendToAPI(itemToDelete, 'delete_bookings.php');
      console.log(e.target.name);

      //Delete bookig from DOM
      let updatedBookingArray = this.state.allBookings;
      updatedBookingArray.splice(e.target.name, 1);
      this.setState({ allBookings: updatedBookingArray });
    }

    handleEdit = (e) => {
      let updatedBooking = Object.assign({}, this.state.bookingToEdit, {
        [e.target.name]: e.target.value
      });
      this.setState({ updatedBooking });
    }


    editBooking = (e) => {
      this.setState({
        editing: true,
        bookingToEdit: this.state.allBookings[e.target.name]}, () => {
          console.log('This item will be edited!', this.state.bookingToEdit)
        });
    }

    saveUpdatedBooking = () => {
      //Send updatedBooking to DB
      this.props.sendToAPI(this.state.updatedBooking, "update_booking.php");

      this.setState({ editing: false }, () => {
        this.setState({ updatedBooking: {}, bookingToEdit: {} })
      });
      console.log('This is our updated booking object:', this.state.updatedBooking);
    }


      render = () => {
        /* Only render if this.state.convertedBookings returns true. */
        if (this.state.convertedBookings) {
          return (
            <div className="container admin-panel">
              <h2>Upcoming bookings</h2>
                <table>
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Time</th>
                      <th>Guests</th>
                      <th>Name</th>
                      <th>Telephone</th>
                      <th>Email</th>
                    </tr>
                  </thead>
                  <tbody>
                    <BookingItem
                      bookingItems={ this.state.allBookings }
                      onEdit={ this.editBooking }
                      handleEdit={ this.handleEdit }
                      onSave={ this.saveUpdatedBooking }
                      onDelete={ this.deleteBooking }
                      isEditing={ this.state.editing }
                      bookingToEdit={ this.state.bookingToEdit }
                    />
                  </tbody>
                </table>
          </div>
        );
      } else {
        return null;
      }
    }
  }
export default AdminComponent;
