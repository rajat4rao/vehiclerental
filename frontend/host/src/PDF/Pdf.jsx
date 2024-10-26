import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';

// Component
const Pdf = (props) => {
    const { BookingList, Logo } = props;

    const styles = StyleSheet.create({
        page: {
            flexDirection: 'column',
            padding: 10,
            alignItems: 'center', 
        },
        section: {
            margin: 10,
            padding: 10,
            flexGrow: 1,
        },
        section1: {
            flexDirection:'row',
            margin: 10,
            flexGrow: 1,
            alignItems:'center',
            
        },
        table: {
            display: 'table',
            width: '100%',
            borderStyle: 'solid',
            borderWidth: 1,
            borderRightWidth: 0,
            borderBottomWidth: 0,
        },
        tableRow: {
            flexDirection: 'row',
        },
        tableCol: {
            width: '14.2%',
            borderStyle: 'solid',
            borderWidth: 1,
            borderLeftWidth: 0,
            borderTopWidth: 0,
        },
        tableCell: {
            margin: 'auto',
            marginTop: 5,
            fontSize: 10,
        },
        logo: {
            width: 100,
            height: 100,
            marginRight: 'auto',
            objectFit: 'contain',
        },
    });

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <View style={styles.section1}>
                    <Image src={Logo} style={styles.logo} /> 
                    <Text>RentnRide</Text> 
                </View>
                <View style={styles.section}>
                    <View style={styles.table}>
                        <View style={styles.tableRow}>
                            <View style={styles.tableCol}><Text style={styles.tableCell}>Customer Name</Text></View>
                            <View style={styles.tableCol}><Text style={styles.tableCell}>Contact No</Text></View>
                            <View style={styles.tableCol}><Text style={styles.tableCell}>Car Number</Text></View>
                            <View style={styles.tableCol}><Text style={styles.tableCell}>Start Date</Text></View>
                            <View style={styles.tableCol}><Text style={styles.tableCell}>Drop Date</Text></View>
                            <View style={styles.tableCol}><Text style={styles.tableCell}>Total Cost</Text></View>
                            <View style={styles.tableCol}><Text style={styles.tableCell}>Ratings</Text></View>
                        </View>
                        {BookingList.map((data, index) => (
                            <View style={styles.tableRow} key={index}>
                                <View style={styles.tableCol}><Text style={styles.tableCell}>{data.userdetails.name}</Text></View>
                                <View style={styles.tableCol}><Text style={styles.tableCell}>{data.userdetails.phone}</Text></View>
                                <View style={styles.tableCol}><Text style={styles.tableCell}>{data.bookingDetails.car_no}</Text></View>
                                <View style={styles.tableCol}><Text style={styles.tableCell}>{data.bookingDetails.start_date.split('-')[2]}-{data.bookingDetails.start_date.split('-')[1]}-{data.bookingDetails.start_date.split('-')[0]}</Text></View>
                                <View style={styles.tableCol}><Text style={styles.tableCell}>{data.bookingDetails.drop_date.split('-')[2]}-{data.bookingDetails.drop_date.split('-')[1]}-{data.bookingDetails.drop_date.split('-')[0]}</Text></View>
                                <View style={styles.tableCol}><Text style={styles.tableCell}>{data.bookingDetails.amount}</Text></View>
                                <View style={styles.tableCol}><Text style={styles.tableCell}>{data.cardetails.ratings}</Text></View>
                            </View>
                        ))}
                    </View>
                </View>
            </Page>
        </Document>
    )
}

export default Pdf;
