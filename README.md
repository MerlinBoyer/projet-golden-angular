# GoldenProject

Angular :
cd dans proj angular
$ ng build --prod
$ sudo rm -r /var/www/html/*
si besoin ssh : $pscp -r ./dist/goldenProject/* pi@DOMAIN_NAME:/home/pi/dist-golden/dist-angular
$ sudo cp -r ./dist/* /var/www/html


MariaDB :
$ sudo apt-get install mariadb-server
$ sudo mysql_secure_installation


Spring :
installer tomcat :https://www.baeldung.com/spring-boot-war-tomcat-deploy
installer java sdk : voir SDKman

compiler le war (eclipse):
decommenter les bonnes variables dans environnement.properties
maven -> build... -> clean package
copier le .war dans /var/lib/tomcat8_DIR/webapps
demarrer tomcat : /var/lib/tomcat8_DIR/bin/catalina.sh run
sinon chercher mvnw


auto boot : 
$ sudo nano /etc/crontab -e
ajouter les lignes pour lancer mariadb & tomcat :
@reboot sudo mysqld
@reboot sudo /var/lib/tomcat8/bin/catalina.sh run




