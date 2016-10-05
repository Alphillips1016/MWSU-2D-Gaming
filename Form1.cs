using System;
using System.IO;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;
using System.Timers;

namespace pressyourluckForm
{
    public struct trivia
    {
        public string question;
        public string answer;
    }

    public struct locations
    {
        public int x;
        public int y;
    }

    public partial class Form1 : Form
    {
        bool stopbuttonPressed = false;
        locations[] LArray = new locations[8];
        Image[] Images = new Image[10];
        PictureBox[] PicBox = new PictureBox[10];
        Player p1 = new Player();
        Player p2 = new Player();
        Player p3 = new Player();
        const int QuizSize = 25;
        public static int randomNum;
        Random rand = new Random();
        public static int playerTurn =1;
        public static int triviaCounter = 0;
        trivia[] triviaArray = new trivia[QuizSize];
       
        public Form1()
        {
            InitializeComponent();
        }

        void LoadImageArray()
        {
            Images[0] = Image.FromFile("..\\..\\Resources\\470.png");
            Images[1] = Image.FromFile("..\\..\\Resources\\500.png");
            Images[2] = Image.FromFile("..\\..\\Resources\\500+.png");
            Images[3] = Image.FromFile("..\\..\\Resources\\500++.png");
            Images[4] = Image.FromFile("..\\..\\Resources\\525.png");
            Images[5] = Image.FromFile("..\\..\\Resources\\530.png");
            Images[6] = Image.FromFile("..\\..\\Resources\\650.png");
            Images[7] = Image.FromFile("..\\..\\Resources\\750+.png");
            Images[8] = Image.FromFile("..\\..\\Resources\\whammy2.png");
            Images[9] = Image.FromFile("..\\..\\Resources\\whammy3.png");

        }
        void LoadPictureBoxes()
        {//Top Left Box
            PicBox[0] = new PictureBox();
            PicBox[0].Image = Images[0];
            PicBox[0].Location = new Point(77, 75);
            PicBox[0].Size = new Size(91, 68);
            PicBox[0].SizeMode = PictureBoxSizeMode.StretchImage;
            pictureBox3.Controls.Add(PicBox[0]);
            PicBox[0].BringToFront();
            //Middle Top
            PicBox[1] = new PictureBox();
            PicBox[1].Image = Images[1];
            PicBox[1].Location = new Point(235, 77);
            PicBox[1].Size = new Size(91, 68);
            PicBox[1].SizeMode = PictureBoxSizeMode.StretchImage;
            pictureBox3.Controls.Add(PicBox[1]);
            PicBox[1].BringToFront();
            //Right Top
            PicBox[2] = new PictureBox();
            PicBox[2].Image = Images[2];
            PicBox[2].Location = new Point(392, 77);
            PicBox[2].Size = new Size(91, 68);
            PicBox[2].SizeMode = PictureBoxSizeMode.StretchImage;
            pictureBox3.Controls.Add(PicBox[2]);
            PicBox[2].BringToFront();
            //Left Middle
            PicBox[3] = new PictureBox();
            PicBox[3].Image = Images[3];
            PicBox[3].Location = new Point(75, 193);
            PicBox[3].Size = new Size(91, 68);
            PicBox[3].SizeMode = PictureBoxSizeMode.StretchImage;
            pictureBox3.Controls.Add(PicBox[3]);
            PicBox[3].BringToFront();
            //Left Bottom
            PicBox[5] = new PictureBox();
            PicBox[5].Image = Images[4];
            PicBox[5].Location = new Point(72, 313);
            PicBox[5].Size = new Size(91, 68);
            PicBox[5].SizeMode = PictureBoxSizeMode.StretchImage;
            pictureBox3.Controls.Add(PicBox[5]);
            PicBox[5].BringToFront();
            //Right Middle
            PicBox[4] = new PictureBox();
            PicBox[4].Image = Images[5];
            PicBox[4].Location = new Point(393, 194);
            PicBox[4].Size = new Size(91, 68);
            PicBox[4].SizeMode = PictureBoxSizeMode.StretchImage;
            pictureBox3.Controls.Add(PicBox[4]);
            PicBox[4].BringToFront();
            //Bottom Right
            PicBox[7] = new PictureBox();
            PicBox[7].Image = Images[6];
            PicBox[7].Location = new Point(394, 313);
            PicBox[7].Size = new Size(91, 68);
            PicBox[7].SizeMode = PictureBoxSizeMode.StretchImage;
            pictureBox3.Controls.Add(PicBox[7]);
            PicBox[7].BringToFront();
            //Bottom Middle
            PicBox[6] = new PictureBox();
            PicBox[6].Image = Images[7];
            PicBox[6].Location = new Point(232, 316);
            PicBox[6].Size = new Size(91, 68);
            PicBox[6].SizeMode = PictureBoxSizeMode.StretchImage;
            pictureBox3.Controls.Add(PicBox[6]);
            PicBox[6].BringToFront();

            PicBox[8] = new PictureBox();
            PicBox[8].Image = Images[8];
            PicBox[8].Size = new Size(91, 68);
            PicBox[8].SizeMode = PictureBoxSizeMode.StretchImage;

            PicBox[9] = new PictureBox();
            PicBox[9].Image = Images[9];
            PicBox[9].Size = new Size(91, 68);
            PicBox[9].SizeMode = PictureBoxSizeMode.StretchImage;

        }
        void RandomizePictureBoxes()
        {
            Image Placeholder;
            int Position = 0;
            for (int i = 0; i < 10; i++)
            {
                Position = rand.Next(10);
                Placeholder = PicBox[i].Image;
                PicBox[i].Image = PicBox[Position].Image;
                PicBox[Position].Image = Placeholder;
            }
        }

        void ReadQuestions()
        {
            try
            {   // Open the text file using a stream reader.
                string[] lines;
                var list = new List<string>();
                var fileStream = new FileStream("..\\..\\Quiz.txt", FileMode.Open, FileAccess.Read);
                using (var streamReader = new StreamReader(fileStream, Encoding.UTF8))
                {
                    string line;
                    while ((line = streamReader.ReadLine()) != null)
                    {
                        list.Add(line);
                    }
                }
                lines = list.ToArray();
                int i = 0;
                int j = 0;
                foreach (string line in lines)
                {
                    if (j % 2 == 1)
                    {
                        triviaArray[i].answer = line.ToUpper();
                        j = (j+1)%2;
                        i++;
                    }
                    if (j % 2 == 0)
                    {
                        triviaArray[i].question = line;
                        j=(j+1)%2;
                    }
                }
            }
            catch (Exception e)
            {
                Console.WriteLine("The file could not be read:");
                Console.WriteLine(e.Message);
            }
        }
        String GetQuestion(int Position)
        {
            return triviaArray[Position].question;
        }
        bool CheckAnswer(String Answer, int Position)
        {
            if (Answer == triviaArray[Position].answer)
                return true;
            else
                return false;
        }

        string QuizQuestion()
        {
            return triviaArray[rand.Next(QuizSize)].question;
        }

        private void nameButton_Click(object sender, EventArgs e)
        {
            FillArray();
            
            pictureBox3.Visible = true;
            pictureBox3.Controls.Add(pictureBox1);
            pictureBox1.Controls.Add(minilightsBox);
            minilightsBox.Location = new Point(0,0);

            spinGroupBox.BackColor = Color.Salmon;
            LoadImageArray();
            LoadPictureBoxes();
            string name1, name2, name3;
            name1 = p1nameTextBox.Text;
            name2 = p2nameTextBox.Text;
            name3 = p3nameTextBox.Text;
            p1.NAME = name1;
            p2.NAME = name2;
            p3.NAME = name3;
            if (string.IsNullOrEmpty(name1))
            {
                p1.NAME = "Player 1";
            }
            if (string.IsNullOrEmpty(name2))
            {
                p2.NAME = "Player 2";
            }
            if (string.IsNullOrEmpty(name3))
            {
                p3.NAME = "Player 3";
            }
            p1nameLabel.Text = p1.NAME;
            p2nameLabel.Text = p2.NAME;
            p3nameLabel.Text = p3.NAME;
            InstructionsLabel.Text = "Alright, now that introductions are out of the way...Let's play!"
                + " This is the trivia portion of the round, Answer the question and win spins!"
                + " First up, is '" +name1+ "', Answer the question! Press the start button to start the trivia."
                + " Please remember to exit the game, press the 'x' in the right corner of the window... ";
            //nameGroupBox.Visible = false;
            quizGroupBox.Visible = true;
            playersboardGroupBox.Visible = true;
            goodluckBox.Visible = true;
            turntextBox.Text = p1.NAME + "'s Turn!";
            ReadQuestions();
            UpdatePlayers();
        }

        //How many questions to ask total before switching to board??
        private void quizButton_Click(object sender, EventArgs e)
        {
            quizButton.Visible = false;
            if (Form1.triviaCounter == 12)
            {
                quizButton.Visible = false;
                startTriviaButton.Visible = false;
                InstructionsLabel.Text = "That's all for the trivia portion, Let's move on to the board on the right!"
                    +"Please Press the Spin button to start the wheel! Make sure not to get a whammy or lose it all!";
                spinButton.Visible = true;
                questionTextBox.Text = null;
                quizGroupBox.Visible = false;
                minilightsBox.Visible = true;
                RandomizePictureBoxes();

                //FREE SPINS YAY :D
                InstructionsLabel.Text += " Oh and here's free spins for everyone just for playing!";
                p1.SPINS++;
                p2.SPINS++;
                p3.SPINS++;
                p1spinsBox.Text = System.Convert.ToString(p1.SPINS);
                p2spinsBox.Text = System.Convert.ToString(p2.SPINS);
                p3spinsBox.Text = System.Convert.ToString(p3.SPINS);

                return;
            }
                string answer = answerTextBox.Text;
                if (CheckAnswer(answer.ToUpper(), Form1.randomNum))
                {
                    switch (Form1.playerTurn)
                    {
                        case 1:
                            Form1.playerTurn++;
                            p1.SPINS++;
                            p1spinsBox.Text = p1.SPINS.ToString();
                            
                            break;
                        case 2:
                            Form1.playerTurn++;
                            p2.SPINS++;
                            p2spinsBox.Text = p2.SPINS.ToString();
                            
                            break;
                        case 3:
                            Form1.playerTurn = 1;
                            p3.SPINS++;
                            p3spinsBox.Text = p3.SPINS.ToString();
                            
                            break;
                    }

                    InstructionsLabel.Text = " That's correct, Nice Job! You win some spins! ";

                }
                else
                {
                    switch (Form1.playerTurn)
                    {
                        case 1:
                            Form1.playerTurn++;
                            break;
                        case 2:
                            Form1.playerTurn++;
                            break;
                        case 3:
                            Form1.playerTurn = 1;
                            break;
                    }
                    InstructionsLabel.Text = " I'm Sorry, that's wrong! That's too bad... ";
                }

                switch (Form1.playerTurn)
                {
                    case 1:
                        InstructionsLabel.Text += " Next up, " + p1.NAME + "!";
                        turntextBox.Text = p1.NAME + "'s Turn!";
                        break;
                    case 2:
                        InstructionsLabel.Text += " Next up, " + p2.NAME + "!";
                        turntextBox.Text = p2.NAME + "'s Turn!";
                        break;
                    case 3:
                        InstructionsLabel.Text += " Next up, " + p3.NAME + "!";
                        turntextBox.Text = p3.NAME + "'s Turn!";
                        break;
                }
                InstructionsLabel.Text += " Answer correctly and win spins!"
                    +" Are you ready for the question? Click the button below!";
                questionTextBox.Text = null;
                answerTextBox.Text = null;
                startTriviaButton.Visible = true;
                Form1.triviaCounter++;
        }

        private void stopButton_Click(object sender, EventArgs e)
        {
            bool endBool2;
            endBool2 = EndGameCheck();
            if (endBool2 == true)
            {
                return;
            }
            stopbuttonPressed = true;
        }

        private void startTriviaButton_Click(object sender, EventArgs e)
        {
            startTriviaButton.Visible = false;
            InstructionsLabel.Text = "Now for the question! Please choose your answer!";
            quizButton.Visible = true;
            answerTextBox.ReadOnly = false;
            int num = rand.Next(QuizSize);
            Form1.randomNum = num;
            questionTextBox.Text = GetQuestion(num);
            startTriviaButton.Text = "Give me the Question!";
        }

        private void UpdatePlayers()
        {
            p1spinsBox.Text = p1.SPINS.ToString();
            p2spinsBox.Text = p2.SPINS.ToString();
            p3spinsBox.Text = p3.SPINS.ToString();
            p1moneyBox.Text = "$ " + p1.MONEY.ToString();
            p2moneyBox.Text = "$ " + p2.MONEY.ToString();
            p3moneyBox.Text = "$ " + p3.MONEY.ToString();
            p1extraBox.Text = p1.EXTRA.ToString();
            p2extraBox.Text = p2.EXTRA.ToString();
            p3extraBox.Text = p3.EXTRA.ToString();
        }

        private void UpdateTurn()
        {
            switch (Form1.playerTurn)
            {
                case 1:
                    Form1.playerTurn++;
                    turntextBox.Text = p2.NAME + "'s Turn!";
                    break;
                case 2:
                    turntextBox.Text = p3.NAME + "'s Turn!";
                    Form1.playerTurn++;
                    break;
                case 3:
                    turntextBox.Text = p1.NAME + "'s Turn!";
                    Form1.playerTurn = 1;
                    break;
            }
        }

        private void FillArray()
        {
            LArray[0].x = 0;//TopLeft
            LArray[0].y = 0;
            LArray[1].x = 158;//TopMiddle
            LArray[1].y = 0;
            LArray[2].x = 313;//TopRight
            LArray[2].y = 0;
            LArray[3].x = 0;//Middleleft
            LArray[3].y = 112;
            LArray[4].x = 318;//MiddleRight
            LArray[4].y = 113;
            LArray[5].x = 0;//LeftBottom
            LArray[5].y = 237;
            LArray[6].x = 155;//MiddleBottom
            LArray[6].y = 237;
            LArray[7].x = 318;//RIghtBottom
            LArray[7].y = 237;
        }

        private bool EndGameCheck()
        {
            if ((p1.SPINS == 0 && p2.SPINS == 0 && p3.SPINS == 0))
            {
                InstructionsLabel.Text = "Well, looks like everyone is out of spins, then as some say..."
                    + " That's all folks! Press x in the corner of the game to end.";
                spinButton.Visible = false;
                stopButton.Visible = false;
                return true;
            }
            return false;
        }

        private async void spinButton_Click(object sender, EventArgs e)
        {
            bool endBool;
            endBool = EndGameCheck();
            if (endBool == true)
            {
                return;
            }

            if (Form1.playerTurn == 1 && p1.SPINS == 0)
            {
                Form1.playerTurn++;
                turntextBox.Text = p1.NAME + "'s Turn!";
                return;
            }
            else if (Form1.playerTurn == 2 && p2.SPINS == 0)
            {
                Form1.playerTurn++;
                turntextBox.Text = p2.NAME + "'s Turn!";
                return;
            }
            else if (Form1.playerTurn == 3 && p3.SPINS == 0)
            {
                Form1.playerTurn = 1;
                turntextBox.Text = p3.NAME + "'s Turn!";
                return;
            }

            stopbuttonPressed = false;
            stopButton.Visible = true;
            int rnum = rand.Next(7);
            while (stopbuttonPressed == false)
            {
                spinButton.Visible = false;
                rnum = rand.Next(7);
                await Task.Delay(500);
                RandomizePictureBoxes();
                minilightsBox.Location = new Point(LArray[rnum].x, LArray[rnum].y);
            }
            spinButton.Visible = true;
            stopButton.Visible = false;
            int x=0, i=0;
            while (i <= 9)
            {
                if (PicBox[rnum].Image == Images[i])
                {
                    x = i;
                }
                i++;
            }

            
                switch (x)
                {
                    case 0:
                        if (Form1.playerTurn == 1)
                        {
                            InstructionsLabel.Text = p1.NAME+" gets 470 dollars! Nice!";
                            p1.MONEY += 470;
                        }
                        else if (Form1.playerTurn == 2)
                        {
                            InstructionsLabel.Text = p2.NAME + " gets 470 dollars! Nice!";
                            p2.MONEY += 470;
                        }
                        else
                        {
                            InstructionsLabel.Text = p3.NAME + " gets 470 dollars! Nice!";
                            p3.MONEY += 470;
                        }
                        break;
                    case 1:
                        if (Form1.playerTurn == 1)
                        {
                            InstructionsLabel.Text = p1.NAME + " gets 500 dollars! Nice!";
                            p1.MONEY += 500;
                        }
                        else if (Form1.playerTurn == 2)
                        {
                            InstructionsLabel.Text = p2.NAME + " gets 500 dollars! Nice!";
                            p2.MONEY += 500;
                        }
                        else
                        {
                            InstructionsLabel.Text = p3.NAME + " gets 500 dollars! Nice!";
                            p3.MONEY += 500;
                        }
                        break;
                    case 2:
                        if (Form1.playerTurn == 1)
                        {
                            InstructionsLabel.Text = p1.NAME + " gets 500 dollars and a free spin! Nice!";
                            p1.MONEY += 500;
                            p1.SPINS += 1;
                        }
                        else if (Form1.playerTurn == 2)
                        {
                            InstructionsLabel.Text = p2.NAME + " gets 500 dollars and a free spin! Nice!";
                            p2.MONEY += 500;
                            p2.SPINS += 1;
                        }
                        else
                        {
                            InstructionsLabel.Text = p3.NAME + " gets 500 dollars and a free spin! Nice!";
                            p3.MONEY += 500;
                            p3.SPINS += 1;
                        }
                        break;
                    case 3:
                        if (Form1.playerTurn == 1)
                        {
                            InstructionsLabel.Text = p1.NAME + " gets 500 dollars and TWO free spins! Very Nice!";
                            p1.MONEY += 500;
                            p1.SPINS += 2;
                        }
                        else if (Form1.playerTurn == 2)
                        {
                            InstructionsLabel.Text = p2.NAME + " gets 500 dollars and TWO free spins! Very Nice!";
                            p2.MONEY += 500;
                            p2.SPINS += 2;
                        }
                        else
                        {
                            InstructionsLabel.Text = p3.NAME + " gets 500 dollars and TWO free spins! Very Nice!";
                            p3.MONEY += 500;
                            p3.SPINS += 2;
                        }
                        break;
                    case 4:
                        if (Form1.playerTurn == 1)
                        {
                            InstructionsLabel.Text = p1.NAME + " gets 525!";
                            p1.MONEY += 525;
                        }
                        else if (Form1.playerTurn == 2)
                        {
                            InstructionsLabel.Text = p2.NAME + " gets 525!";
                            p2.MONEY += 525;
                        }
                        else
                        {
                            InstructionsLabel.Text = p3.NAME + " gets 525!";
                            p3.MONEY += 525;
                        }
                        break;
                    case 5:
                        if (Form1.playerTurn == 1)
                        {
                            InstructionsLabel.Text = p1.NAME + " gets 530!";
                            p1.MONEY += 530;
                        }
                        else if (Form1.playerTurn == 2)
                        {
                            InstructionsLabel.Text = p2.NAME + " gets 530!";
                            p2.MONEY += 530;
                        }
                        else
                        {
                            InstructionsLabel.Text = p3.NAME + " gets 530!";
                            p3.MONEY += 530;
                        }
                        break;
                    case 6:
                        if (Form1.playerTurn == 1)
                        {
                            InstructionsLabel.Text = p1.NAME + " gets 650! It's all yours buddy!";
                            p1.MONEY += 650;
                        }
                        else if (Form1.playerTurn == 2)
                        {
                            InstructionsLabel.Text = p2.NAME + " gets 650! It's all yours buddy!";
                            p2.MONEY += 650;
                        }
                        else
                        {
                            InstructionsLabel.Text = p3.NAME + " gets 650! It's all yours buddy!";
                            p3.MONEY += 650;
                        }
                        break;
                    case 7:
                        if (Form1.playerTurn == 1)
                        {
                            InstructionsLabel.Text = p1.NAME + " gets 750 dollars and a free spin! Nice!";
                            p1.MONEY += 750;
                            p1.SPINS += 1;
                        }
                        else if (Form1.playerTurn == 2)
                        {
                            InstructionsLabel.Text = p2.NAME + " gets 750 dollars and a free spin! Nice!";
                            p2.MONEY += 750;
                            p2.SPINS += 1;
                        }
                        else
                        {
                            InstructionsLabel.Text = p3.NAME + " gets 750 dollars and a free spin! Nice!";
                            p3.MONEY += 750;
                            p3.SPINS += 1;
                        }
                        break;
                    default:

                        if (Form1.playerTurn == 1)
                        {
                            InstructionsLabel.Text = p1.NAME + " gets ..! Nothing, Sorry, but that's a whammy! You lose everything..";
                            p1.MONEY = 0;
                            p1.SPINS = 0;
                            p1.EXTRA = 0;
                        }
                        else if (Form1.playerTurn == 2)
                        {
                            InstructionsLabel.Text = p2.NAME + " gets ..! Nothing, Sorry, but that's a whammy! You lose everything..";
                            p2.MONEY = 0;
                            p2.SPINS = 0;
                            p2.EXTRA = 0;
                        }
                        else
                        {
                            InstructionsLabel.Text = p3.NAME + " gets ..! Nothing, Sorry, but that's a whammy! You lose everything..";
                            p3.MONEY = 0;
                            p3.SPINS = 0;
                            p3.EXTRA = 0;
                        }
                        break;
                }

                switch (Form1.playerTurn)
                {
                    case 1:
                        p1.SPINS--;
                        break;
                    case 2:
                        p2.SPINS--;
                        break;
                    case 3:
                        p3.SPINS--;
                        break;
                }

                UpdateTurn();
                UpdatePlayers();

                spinButton.Visible = true;
                InstructionsLabel.Text += " \n\nThat's the end of that turn, on to the next player to spin!";
            //call function here and turn spin back on
        }

        private void passButton_Click(object sender, EventArgs e)
        {
            //player count variable for all methods to pass a spin here
            spinButton.Visible = true;
        }
    }
}
