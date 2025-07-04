#   M o c k I n t   -   O n l i n e   T e s t i n g   P l a t f o r m 
 
 A   c o m p r e h e n s i v e   m o c k   i n t e r v i e w   a n d   t e s t   p r e p a r a t i o n   p l a t f o r m   s u p p o r t i n g   m u l t i p l e   c o m p e t i t i v e   e x a m s   i n c l u d i n g   J E E ,   C A T ,   N E E T ,   G A T E ,   a n d   U P S C . 
 
 # #   <��  F e a t u r e s 
 
 -   * * M u l t i - E x a m   S u p p o r t * * :   J E E ,   C A T ,   N E E T ,   G A T E ,   U P S C   p r e p a r a t i o n 
 -   * * R e a l - t i m e   T e s t i n g * * :   T i m e r - b a s e d   m o c k   t e s t s   w i t h   a u t o - s u b m i t 
 -   * * Q u e s t i o n   B a n k * * :   C o m p r e h e n s i v e   q u e s t i o n   d a t a b a s e   w i t h   d i f f i c u l t y   l e v e l s 
 -   * * A n a l y t i c s * * :   D e t a i l e d   t e s t   r e s u l t s   a n d   p e r f o r m a n c e   t r a c k i n g 
 -   * * A d m i n   P a n e l * * :   Q u e s t i o n   m a n a g e m e n t   a n d   u s e r   a n a l y t i c s 
 -   * * S e c u r i t y * * :   J W T   a u t h e n t i c a t i o n ,   r a t e   l i m i t i n g ,   i n p u t   v a l i d a t i o n 
 -   * * R e s p o n s i v e   D e s i g n * * :   M o b i l e - f r i e n d l y   i n t e r f a c e 
 
 # #   =؀�  Q u i c k   S t a r t 
 
 # # #   P r e r e q u i s i t e s 
 -   N o d e . j s   ( v 1 6   o r   h i g h e r ) 
 -   n p m   ( v 8   o r   h i g h e r )     
 -   M o n g o D B   ( l o c a l   o r   c l o u d   i n s t a n c e ) 
 
 # # #   I n s t a l l a t i o n 
 
 1 .   * * I n s t a l l   a l l   d e p e n d e n c i e s * * 
       ` ` ` b a s h 
       n p m   r u n   i n s t a l l : a l l 
       ` ` ` 
 
 2 .   * * S e t   u p   e n v i r o n m e n t   v a r i a b l e s * * 
       
       C r e a t e   ` . e n v `   f i l e s   u s i n g   t h e   e x a m p l e s : 
       ` ` ` b a s h 
       c p   B a c k e n d / . e n v . e x a m p l e   B a c k e n d / . e n v 
       c p   F r o n t e n d / . e n v . e x a m p l e   F r o n t e n d / . e n v 
       ` ` ` 
 
 3 .   * * S e e d   t h e   d a t a b a s e * * 
       ` ` ` b a s h 
       n p m   r u n   s e e d 
       ` ` ` 
 
 4 .   * * S t a r t   d e v e l o p m e n t   s e r v e r s * * 
       ` ` ` b a s h 
       n p m   r u n   d e v 
       ` ` ` 
 
 T h e   a p p l i c a t i o n   w i l l   b e   a v a i l a b l e   a t : 
 -   F r o n t e n d :   h t t p : / / l o c a l h o s t : 3 0 0 0 
 -   B a c k e n d   A P I :   h t t p : / / l o c a l h o s t : 5 0 0 0 
 
 # #   =���  A P I   D o c u m e n t a t i o n 
 
 C o m p r e h e n s i v e   A P I   d o c u m e n t a t i o n   i s   a v a i l a b l e   i n   [ ` A P I _ D O C U M E N T A T I O N . m d ` ] ( . / A P I _ D O C U M E N T A T I O N . m d ) . 
 
 # #   =��  S e c u r i t y   F e a t u r e s 
 
 -   * * A u t h e n t i c a t i o n * * :   J W T - b a s e d   w i t h   2 - h o u r   e x p i r a t i o n 
 -   * * P a s s w o r d   S e c u r i t y * * :   B c r y p t   h a s h i n g   w i t h   1 0   s a l t   r o u n d s 
 -   * * R a t e   L i m i t i n g * * :   1 0 0   r e q u e s t s / 1 5 m i n   ( g e n e r a l ) ,   5   r e q u e s t s / 1 5 m i n   ( a u t h ) 
 -   * * I n p u t   V a l i d a t i o n * * :   J o i   s c h e m a s   w i t h   s a n i t i z a t i o n 
 -   * * N o S Q L   I n j e c t i o n   P r e v e n t i o n * * :   M o n g o D B   q u e r y   s a n i t i z a t i o n 
 -   * * C O R S   P r o t e c t i o n * * :   C o n f i g u r e d   f o r   s p e c i f i c   o r i g i n s 
 -   * * S e c u r i t y   H e a d e r s * * :   H e l m e t . j s   i m p l e m e n t a t i o n 
 
 # #   =�'�  D e v e l o p m e n t   S c r i p t s 
 
 ` ` ` b a s h 
 n p m   r u n   d e v                                   #   S t a r t   b o t h   f r o n t e n d   a n d   b a c k e n d 
 n p m   r u n   b a c k e n d : d e v                   #   S t a r t   b a c k e n d   o n l y     
 n p m   r u n   f r o n t e n d : d e v                 #   S t a r t   f r o n t e n d   o n l y 
 n p m   t e s t                                         #   R u n   b a c k e n d   t e s t s 
 n p m   r u n   l i n t                                 #   L i n t   a l l   c o d e 
 n p m   r u n   s e e d                                 #   S e e d   d a t a b a s e   w i t h   s a m p l e   d a t a 
 n p m   r u n   s e t u p                               #   I n s t a l l   a l l   d e p s   +   s e e d   d a t a b a s e 
 ` ` ` 
 
 # #   =���  R e c e n t   I m p r o v e m e n t s 
 
 '  * * S e c u r i t y   V u l n e r a b i l i t i e s   F i x e d * * 
 '  * * D a t a b a s e   P e r f o r m a n c e   O p t i m i z e d * *   
 '  * * A P I   D e s i g n   S t a n d a r d i z e d * * 
 '  * * C o n f i g u r a t i o n   I m p r o v e d * * 
 '  * * D o c u m e n t a t i o n   A d d e d * * 
 '  * * T e s t i n g   F r a m e w o r k   S e t u p * * 
 
 F o r   d e t a i l e d   i n f o r m a t i o n ,   s e e   [ C L A U D E . m d ] ( . / C L A U D E . m d )   a n d   [ A P I _ D O C U M E N T A T I O N . m d ] ( . / A P I _ D O C U M E N T A T I O N . m d ) . 