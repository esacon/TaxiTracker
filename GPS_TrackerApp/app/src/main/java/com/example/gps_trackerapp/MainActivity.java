package com.example.gps_trackerapp;

import android.Manifest;
import android.annotation.SuppressLint;
import android.content.pm.PackageManager;
import android.os.Bundle;
import android.os.Handler;
import android.view.View;
import android.widget.EditText;
import android.widget.TextView;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;
import androidx.core.app.ActivityCompat;

public class MainActivity extends AppCompatActivity {

    private EditText ipEditText;
    private TextView latitudeText;
    private TextView longitudeText;
    private Handler handler;
    private String destIP;
    private GpsTracker gpsTracker;
    private MessageSenderUDP msg_udp;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        handler = new Handler();

        // Grant permissions.
        requestPermissions();

        // Get information for sending the message.
        ipEditText = findViewById(R.id.ipEditText);
        latitudeText = findViewById(R.id.latitudeText);
        longitudeText = findViewById(R.id.longitudeText);
    }

    public void iniciar(View view) {
        // Initialize GPS.
        gpsTracker = new GpsTracker(MainActivity.this);
        // Success notification.
        Toast.makeText(getApplicationContext(), "La aplicación ha iniciado.", Toast.LENGTH_LONG).show();
        runnable.run();
    }

    public void detener(View view) {
        // Success notification.
        Toast.makeText(getApplicationContext(), "La aplicación se ha detenido.", Toast.LENGTH_LONG).show();
        handler.removeCallbacks(runnable);
    }

    public Runnable runnable = new Runnable() {
        public void run() {
            destIP = ipEditText.getText().toString().trim();

            if (!destIP.equals("")) {
                // Initialize UDP protocols.
                msg_udp = new MessageSenderUDP(destIP, 8888);
                sendMsg();
                handler.postDelayed(runnable, 5000); // 5 seconds.
            } else {
                Toast.makeText(getApplicationContext(), "Ha ocurrido un error, por favor revise los datos.", Toast.LENGTH_LONG).show();
            }
        }
    };

    public void sendMsg() {

        // Grant permissions.
        requestPermissions();

        if (checkPermissions()) {

            // Get GPS Location.
            gpsTracker.getLocation();

            if (gpsTracker.canGetLocation()) {
                double latitude = gpsTracker.getLatitude();
                double longitude = gpsTracker.getLongitude();
                double timeStamp = gpsTracker.getTimeStamp();

                // Send Message.
                @SuppressLint("DefaultLocale") String message = String.format("%s;%s;%s", latitude, longitude, timeStamp);
                latitudeText.setText(String.format("Latitud:\t%s", latitude));
                longitudeText.setText(String.format("Longitud:\t%s", longitude));

                // Send the message.
                msg_udp.execute(message);
            } else {
                gpsTracker.showSettingsAlert();
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