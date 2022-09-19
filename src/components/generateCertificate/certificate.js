import React from "react";
import { Page, Document, StyleSheet, Image } from "@react-pdf/renderer";
import backgroundImage from "../../img/WGB-diploma.png";
import { Text, View } from '@react-pdf/renderer';
import { textTransform } from "@mui/system";

const styles = StyleSheet.create({
    page: {
  
    },
    backgroundImage: {
        position: 'absolute',
        minWidth: '100%',
        minHeight: '100%',
        display: 'block',
        height: '100%',
        width: '100%',
    },
    section: {
        position: 'absolute',
        minWidth: '100%',
        minHeight: '100%',
        display: 'block',
        height: '100%',
        width: '100%',
    },
    mainContent: { 
        marginTop: "180px",
        textAlign: "center"
    },
    bigText: { 
        marginTop: "10px",
        color:"#000000",
        fontSize: "24pt",
        fontWeight: "800",
        textTransform: "uppercase"
    },
    bigTextColor: { 
        marginTop: "0px",
        color:"#ce6328",
        fontSize: "22pt",
        textTransform: "uppercase",
        fontWeight: "100",
    },
    smallText: { 
        marginTop: "15px",
        color:"#000000",
        fontSize: "12pt",
        textTransform: "uppercase",
    },
    secondSmallText: { 
        marginTop: "13px",
        color:"#000000",
        fontSize: "12pt", 
    },
    metaData: {
        position:"absolute",
        fontSize: "10pt", 
        color:"#000000",
        bottom:"40px",
        left: "40px"
    },
    nameOfDirector: {
        marginTop: "60px",
        color:"#ce6328",
        fontSize: "14pt",
    },
    roleOfCEO: {
        marginTop: "0px",
        color:"#000000",
        fontSize: "14pt",
    }
});

const Certificate = ({ category, course , nameOfStudent, certNumber, certDate}) => {
    return (
        <Document>
            <Page size="A5" style={styles.page} >
                <View style={styles.section}>
                    
                <Image style={styles.backgroundImage} src={backgroundImage} >
                </Image> 
                <View style={styles.mainContent} >

                <View style={styles.bigText} >
                    <Text>{category}</Text>  
                </View>
                <View style={styles.bigTextColor} >
                    <Text>Certificate</Text>  
                </View>


                <View style={styles.smallText} >
                    <Text>PROUDLY PRESENTED TO</Text>  
                </View>


                <View style={styles.bigText} >
                    <Text>{nameOfStudent}</Text>  
                </View>


                <View style={styles.secondSmallText} >
                    <Text>for completing "{course}"</Text>  
                </View>


                <View style={styles.secondSmallText} >
                    <Text>This certificate was awareded by:</Text>  
                </View>


                <View style={styles.nameOfDirector} >
                    <Text>ALEXIS ALCALA</Text>  
                </View>

                <View style={styles.roleOfCEO} >
                    <Text>Director</Text>  
                </View>

                </View>

                <View style={styles.metaData}>
                    <Text>Certificate number: {certNumber}</Text>  
                    <Text>Date of achievement: {certDate}</Text>  
                </View>

                </View>
            </Page>
        </Document>
    );
}

export default Certificate;