package com.example.gps_trackerapp;

import android.Manifest;
import android.annotation.SuppressLint;
import android.content.pm.PackageManager;
import android.os.Bundle;
import android.view.View;
import android.widget.EditText;
import android.widget.TextView;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;
import androidx.core.app.ActivityCompat;

public class MainActivity extends AppCompatActivity {

    private EditText ipEditText;
    private EditText portUDPEditText;
    private EditText portTCPEditText;
    private TextView latitudeText;
    private TextView longitudeText;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        // Grant permissions.
        requestPermissions();

        // Get information for sending the message.
        ipEditText = findViewById(R.id.ipEditText);
        portUDPEditText = findViewById(R.id.portUDPEditText);
        portTCPEditText = findViewById(R.id.portTCPEditText);
        latitudeText = findViewById(R.id.latitudeText);
        longitudeText = findViewById(R.id.longitudeText);
    }

    public void sendMsg(View view) {

        String destIP = ipEditText.getText().toString().trim();
        int port_UDP = Integer.parseInt(portUDPEditText.getText().toString().trim());
        int port_TCP = Integer.parseInt(portTCPEditText.getText().toString().trim());

        // Grant permissions.
        requestPermissions();

        if (checkPermissions()) {
            if (!destIP.equals("") && port_UDP != 0 && port_TCP != 0) {

                GpsTracker gpsTracker = new GpsTracker(MainActivity.this);
                // Initialize both protocols.
                MessageSenderTCP msg_tcp = new MessageSenderTCP(destIP, port_TCP);
                MessageSenderUDP msg_udp = new MessageSenderUDP(destIP, port_UDP);

                if (gpsTracker.canGetLocation()) {
                    double latitude = gpsTracker.getLatitude();
                    double longitude = gpsTracker.getLongitude();
                    // Send Message.
                    @SuppressLint("DefaultLocale") String url = String.format("https://www.google.com/maps/search/%f,%f", latitude, longitude);
                    @SuppressLint("DefaultLocale") String message = String.format("¡Hola! Mis coordenadas son:\n\nLatitud: %.8f \nLongitud: %.8f \nGoogle Maps: %s", latitude, longitude, url);
                    latitudeText.setText(String.format("Latitud:\t%s", latitude));
                    longitudeText.setText(String.format("Longitud:\t%s", longitude));
                    // Send the message.
                    msg_udp.execute(message);
                    msg_tcp.execute(message);
                    // Success notification.
                    Toast.makeText(getApplicationContext(), "Mensaje enviado con éxito.", Toast.LENGTH_LONG).show();
                } else {
                    gpsTracker.showSettingsAlert();
                }
            } else {
                Toast.makeText(getApplicationContext(), "Ha ocurrido un error, por favor revise los datos.", Toast.LENGTH_LONG).show();
            }
        } else {
            Toast.makeText(getApplicationContext(), "Por favor acepte todos los permisos.", Toast.LENGTH_LONG).show();
            requestPermissions();
        }
    }

    private boolean checkPermissions() {
        return ActivityCompat.checkSelfPermission(MainActivity.this, Manifest.permission.ACCESS_FINE_LOCATION) == PackageManager.PERMISSION_GRANTED
                && ActivityCompat.checkSelfPermission(MainActivity.this, Manifest.permission.ACCESS_COARSE_LOCATION) == PackageManager.PERMISSION_GRANTED
                && ActivityCompat.checkSelfPermission(MainActivity.this, Manifest.permission.INTERNET) == PackageManager.PERMISSION_GRANTED;
    }

    private void requestPermissions() {
        if (ActivityCompat.checkSelfPermission(MainActivity.this, Manifest.permission.ACCESS_FINE_LOCATION) != PackageManager.PERMISSION_GRANTED) {
            ActivityCompat.requestPermissions(MainActivity.this, new String[]{Manifest.permission.ACCESS_FINE_LOCATION}, 1000);
        }
        if (ActivityCompat.checkSelfPermission(MainActivity.this, Manifest.permission.ACCESS_COARSE_LOCATION) != PackageManager.PERMISSION_GRANTED) {
            ActivityCompat.requestPermissions(MainActivity.this, new String[]{Manifest.permission.ACCESS_COARSE_LOCATION}, 1000);
        }
        if (ActivityCompat.checkSelfPermission(MainActivity.this, Manifest.permission.INTERNET) != PackageManager.PERMISSION_GRANTED) {
            ActivityCompat.requestPermissions(MainActivity.this, new String[]{Manifest.permission.INTERNET}, 1000);
        }
    }
}