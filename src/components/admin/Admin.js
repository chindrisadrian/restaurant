import React from "react";
import Bookings from "./Bookings";

class Admin extends React.Component {
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
      this.props.fetchBookings("fetch_bookings_and_customers.php")
        .then((bookings) => {
          this.setState({ allBookings: bookings }, () => {
            const convertedBookings = this.props.convertFromStringToDate(bookings);
            this.setState({ convertedBookings });
        })
      })
    }

    /*******************************************/
    /************* DELETE BOOKING **************/
    /*******************************************/

    deleteBooking = (e) => {
      const itemToDelete = {
        itemToDelete: e.target.id
      };

      // Delete booking from DB
      this.props.sendToAPI(itemToDelete, "delete_bookings.php");

      // Delete bookig from DOM
      let updatedBookingArray = this.state.allBookings;
      updatedBookingArray.splice(e.target.name, 1);
      this.setState({ allBookings: updatedBookingArray });
    }

    /*******************************************/
    /*************** EDIT BOOKING **************/
    /*******************************************/

    handleEdit = (e) => {
      let updatedBooking = Object.assign({}, this.state.bookingToEdit, {
        [e.target.name]: e.target.value
      });
      this.setState({ updatedBooking });
    }


    editBooking = (e) => {
      this.setState({
        editing: true,
        editIndex: e.target.name,
        bookingToEdit: this.state.allBookings[e.target.name]});
    }

    saveUpdatedBooking = () => {
      const allBookings = this.state.allBookings;
      if (Object.keys(this.state.updatedBooking).length === 0) {
        allBookings[this.state.editIndex] = this.state.bookingToEdit;
        this.setState({ allBookings });
      }
      else {
      allBookings[this.state.editIndex] = this.state.updatedBooking;
      this.setState({ allBookings });
    }

      this.setState({ allBookings: this.state.allBookings }, () => {
        this.setState({
          editing:false,
          updatedBooking: {},
          bookingToEdit: {}
        });
      });

      // Send updatedBooking to DB
      this.props.sendToAPI(this.state.updatedBooking, "update_booking.php");
    }

      render = () => {
        // Only render if this.state.convertedBookings returns true.
        if (this.state.convertedBookings) {
          return (
            <div class="admin-container">
              <div className="admin-panel">
                <h2>Bookings</h2>
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
                      <Bookings
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
          </div>
        );
      } else {
        return null;
      }
    }
  }
export default Admin;
